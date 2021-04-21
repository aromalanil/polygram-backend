import {
  validateNumber,
  validateString,
  validateMongooseId,
  validateStringArray,
} from '../helpers/validation';

import Topic from '../models/topic';
import Question from '../models/question';

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
    const { topic, before_id, after_id, page_size = 10 } = req.query;

    // Validating request body
    try {
      validateString(topic, 2, 30, 'topic', false);
      validateMongooseId(before_id, 'before_id', false);
      validateMongooseId(after_id, 'after_id', false);
      validateNumber(page_size, 5, 50, 'page_size', false);
    } catch (err) {
      return res.badRequest(err.message);
    }

    const query = {};

    // Adding topic based filter if topic exist in query
    if (topic) {
      query.topics = { $elemMatch: { $eq: topic } };
    }
    // If no topic is provided filter will be based on user followed topics
    else if (user) {
      const topicsUserFollows = user.followed_topics;
      if (topicsUserFollows.length !== 0) {
        query.topics = { $elemMatch: { $in: topicsUserFollows } };
      }
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
}
