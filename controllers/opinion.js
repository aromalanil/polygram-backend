import mongoose from 'mongoose';
import Opinion from '../models/opinion';
import Question from '../models/question';
import { validateMongooseId, validateNumber, validateString } from '../helpers/validation';

export default class OpinionController {
  addOpinion = async (req, res) => {
    const { user } = req;
    const { question_id, content, option } = req.body;

    // Validating request body
    try {
      validateMongooseId(question_id, 'question_id', true);
      validateString(content, 5, 1600, 'content', true);
      validateString(option, 1, 30, 'option', true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    // Check if user have already posted an opinion
    const doesOpinionOfUserExist = await Opinion.exists({ question_id, author: user._id });
    if (doesOpinionOfUserExist) {
      return res.conflict('User can only post single opinion for a question');
    }

    // Finding question with corresponding ID
    const question = await Question.findById(question_id).select('options').lean();

    // Checking if question exist
    if (!question) {
      return res.notFound('Question does not exist');
    }

    // Check if provided option is valid
    const isOptionValid = question.options.includes(option);
    if (!isOptionValid) {
      return req.badRequest('Invalid opinion');
    }

    let opinion = new Opinion({
      option,
      content,
      question_id,
      author: user._id,
      upvotes: [user._id],
    });

    try {
      opinion = await opinion.save();
    } catch (err) {
      return res.internalServerError('Error creating opinion');
    }

    res.status(201).json({ msg: 'Opinion created successfully', data: { opinion } });
  };

  removeOpinion = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    // Validating request body
    try {
      validateMongooseId(id, 'id', true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    // Fetching opinion from database
    const opinionToDelete = await Opinion.findById(id);
    if (!opinionToDelete) {
      return res.notFound('Opinion not found');
    }

    // Checking if the user is the author of the opinion
    if (opinionToDelete.author !== user._id) {
      return res.unAuthorizedRequest("You don't have the permission to delete this opinion");
    }

    // Deleting opinion from DB
    try {
      await opinionToDelete.delete();
    } catch (err) {
      return res.internalServerError('Error deleting opinion');
    }

    res.status(200).json({
      msg: 'Opinion deleted successfully',
      data: { opinion: opinionToDelete },
    });
  };

  findOpinions = async (req, res) => {
    const { user } = req;
    const { question_id, before_id, after_id } = req.query;

    let { page_size = 5 } = req.query;
    page_size = parseInt(page_size, 10);

    // Validating request body
    try {
      validateMongooseId(question_id, 'question_id', true);
      validateMongooseId(before_id, 'before_id', false);
      validateMongooseId(after_id, 'after_id', false);
      validateNumber(page_size, 5, 50, 'page_size', false);
    } catch (err) {
      return res.badRequest(err.message);
    }

    const query = { question_id: mongoose.Types.ObjectId(question_id) };

    // If after_id is provided only include topics posted after after_id
    if (after_id) {
      query._id = { $gt: mongoose.Types.ObjectId(after_id) };
    } else if (before_id) {
      query._id = { $lt: mongoose.Types.ObjectId(before_id) };
    }

    // Add is_upvoted & is_downvoted to the result if user is logged in
    const addFieldQuery = [];
    if (user) {
      addFieldQuery.push({
        $addFields: {
          is_upvoted: { $cond: [{ $in: [user._id.toString(), '$upvotes'] }, true, false] },
          is_downvoted: { $cond: [{ $in: [user._id.toString(), '$downvotes'] }, true, false] },
        },
      });
    }

    const authorFieldsToExclude = [
      'author.__v',
      'author._id',
      'author.verified',
      'author.followed_topics',
      'author.otp',
      'author.password',
      'author.email',
    ];

    const opinions = await Opinion.aggregate([
      { $match: query },
      { $sort: { _id: -1 } },
      { $limit: page_size },
      {
        $addFields: {
          upvote_count: { $size: '$upvotes' },
          downvote_count: { $size: '$downvotes' },
        },
      },
      ...addFieldQuery,
      { $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'author' } },
      { $unwind: '$author' },
      { $unset: [...authorFieldsToExclude, 'upvotes', 'downvotes', '__v'] },
    ]);

    res.status(200).json({ msg: 'Opinions Found', opinions });
  };

  addUpvote = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    // Validating request body
    try {
      validateMongooseId(id, 'id', true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    const opinion = await Opinion.findById(id);

    if (!opinion) {
      req.notFound('Opinion not found');
    }

    const loggedInUserID = user._id.toString();

    // Adding user id to upvote array of opinion
    opinion.upvotes = [...new Set([...opinion.upvotes, loggedInUserID])];

    // Removing user's downvote from array if present
    opinion.downvotes = opinion.downvotes.filter((userId) => userId !== loggedInUserID);

    try {
      await opinion.save();
    } catch (err) {
      res.internalServerError('Upvote failed');
    }

    res.status(201).json({
      msg: 'Upvote added successfully',
      data: {
        upvote_count: opinion.upvotes.length,
        downvote_count: opinion.downvotes.length,
      },
    });
  };

  addDownvote = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    // Validating request body
    try {
      validateMongooseId(id, 'id', true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    const opinion = await Opinion.findById(id);

    if (!opinion) {
      req.notFound('Opinion not found');
    }

    const loggedInUserID = user._id.toString();

    // Adding user id to downvote array of opinion
    opinion.downvotes = [...new Set([...opinion.downvotes, loggedInUserID])];

    // Removing user's upvote from array if present
    opinion.upvotes = opinion.upvotes.filter((userId) => userId !== loggedInUserID);

    try {
      await opinion.save();
    } catch (err) {
      res.internalServerError('Downvote failed');
    }

    res.status(201).json({
      msg: 'Downvote added successfully',
      data: {
        upvote_count: opinion.upvotes.length,
        downvote_count: opinion.downvotes.length,
      },
    });
  };

  removeUpvote = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    // Validating request body
    try {
      validateMongooseId(id, 'id', true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    const opinion = await Opinion.findById(id);

    if (!opinion) {
      req.notFound('Opinion not found');
    }

    const loggedInUserID = user._id.toString();

    // Removing user's upvote from array if present
    opinion.upvotes = opinion.upvotes.filter((userId) => userId !== loggedInUserID);

    try {
      opinion.markModified('upvotes');
      await opinion.save();
    } catch (err) {
      res.internalServerError('Removing upvote failed');
    }

    res.status(201).json({
      msg: 'Upvote removed successfully',
      data: {
        upvote_count: opinion.upvotes.length,
      },
    });
  };

  removeDownvote = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    // Validating request body
    try {
      validateMongooseId(id, 'id', true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    const opinion = await Opinion.findById(id);

    if (!opinion) {
      req.notFound('Opinion not found');
    }

    const loggedInUserID = user._id.toString();

    // Removing user's downvote from array if present
    opinion.downvotes = opinion.downvotes.filter((userId) => userId !== loggedInUserID);

    try {
      await opinion.save();
    } catch (err) {
      res.internalServerError('Removing downvote failed');
    }

    res.status(201).json({
      msg: 'Downvote removed successfully',
      data: {
        downvote_count: opinion.downvotes.length,
      },
    });
  };
}
