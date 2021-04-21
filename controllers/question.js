import {
  validateNumber,
  validateString,
  validateMongooseId,
  validateStringArray,
  validateBoolean,
} from '../helpers/validation';

import Topic from '../models/topic';
import Question from '../models/question';
import { stringToBoolean } from '../helpers/convertors';

export default class QuestionController {
  findSingleQuestion = async (req, res) => {
    const { id } = req.params;

    // Validating request body
    try {
      validateMongooseId(id, 'id', true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    // Finding question with corresponding ID
    const question = await Question.findById(id).lean();

    // TODO Calculate percentage of each option

    // Checking if question exist
    if (!question) {
      return res.notFound('Question does not exist');
    }

    res.status(200).json({
      msg: 'Question Found',
      question,
    });
  };

  findQuestions = async (req, res) => {
    const { user } = req;
    const {
      topic,
      search,
      user_id,
      before_id,
      after_id,
      page_size = 10,
      following = 'false',
    } = req.query;

    // Validating request body
    try {
      validateString(topic, 2, 30, 'topic', false);
      validateString(search, 0, 50, 'search', false);
      validateMongooseId(before_id, 'before_id', false);
      validateMongooseId(after_id, 'after_id', false);
      validateNumber(page_size, 5, 50, 'page_size', false);
      validateMongooseId(user_id, 'user_id', false);
      validateBoolean(stringToBoolean(following), 'following', false);
    } catch (err) {
      return res.badRequest(err.message);
    }

    const query = {};

    // Adding search based filter if search is provided
    if (search) {
      query.$text = { $search: search };
    }

    // Adding user following based filter if following is provided
    if (stringToBoolean(following) && user) {
      const topicsUserFollows = user.followed_topics;
      if (topicsUserFollows.length !== 0) {
        query.topics = { $elemMatch: { $in: topicsUserFollows } };
      }
    }

    // Adding topic based filter if topic exist in query
    if (topic) {
      query.topics = { $elemMatch: { $eq: topic } };
    }

    // Adding user based filter if user_id is provided
    if (user_id) {
      query.author = user_id;
    }

    // If after_id is provided only include questions posted after after_id
    if (after_id) {
      query._id = { $lt: after_id };
    } else if (before_id) {
      query._id = { $gt: before_id };
    }

    const questions = await Question.find(query).sort({ _id: 'descending' }).limit(page_size);

    res.status(200).json({
      msg: 'Questions found',
      questions,
    });
  };

  createQuestion = async (req, res) => {
    const { user } = req;
    const { title, content, options, topics } = req.body;

    // Validating request body
    try {
      validateString(title, 15, 150, 'title', true);
      validateString(content, 30, 1000, 'content', true);
      validateStringArray(options, 1, 30, 'options', 2, 5, true);
      validateStringArray(topics, 2, 30, 'topics', 1, 5, true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    // Checking if all provided topics are valid
    const topicInDBCount = await Topic.countDocuments({ name: { $in: topics } });
    if (topicInDBCount !== topics.length) {
      return res.badRequest('Some or all topics provided does not exist');
    }

    const { _id: author } = user;
    const question = new Question({
      title,
      author,
      content,
      options,
      topics,
    });

    try {
      await question.save();
    } catch (err) {
      return res.internalServerError('Error creating question');
    }

    res.status(200).json({ msg: 'Question successfully created' });
  };

  removeQuestion = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    // Validating request body
    try {
      validateMongooseId(id, 'id', true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    // Fetching question from database
    const questionToDelete = await Question.findById(id);
    if (!questionToDelete) {
      return res.notFound('Question not found');
    }

    // Checking if the user is the author of the question
    if (questionToDelete.author !== user._id) {
      return res.unAuthorizedRequest("You don't have the permission to delete this question");
    }

    // Deleting question from DB
    try {
      await questionToDelete.delete();
    } catch (err) {
      return res.internalServerError('Error deleting question');
    }

    res.status(200).json({
      msg: 'Question deleted successfully',
      data: { question: questionToDelete },
    });
  };
}
