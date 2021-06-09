import Topic from '../models/topic';
import Question from '../models/question';
import { stringToBoolean } from '../helpers/convertors';

import {
  validateNumber,
  validateString,
  validateBoolean,
  validateMongooseId,
  validateStringArray,
} from '../helpers/validation';

export default class TopicController {
  findSingleTopic = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    // Validating request body
    try {
      validateMongooseId(id, 'id', true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    // Finding topic with corresponding ID
    const topic = await Topic.findById(id).select('-__v').lean();

    // Checking if topic exist
    if (!topic) {
      return res.notFound('Topic does not exist');
    }

    // Adding if user follows the topic info
    const topicsFollowedByUser = user?.followed_topics ?? [];
    topic.followed_by_user = topicsFollowedByUser.includes(topic.name);

    res.status(200).json({
      msg: 'Topic Found',
      data: { topic },
    });
  };

  findTopic = async (req, res) => {
    const { user } = req;
    const { count = 'false', search, before_id, after_id } = req.query;

    let { page_size = 5 } = req.query;
    page_size = parseInt(page_size, 10);

    // Validating request body
    try {
      validateBoolean(stringToBoolean(count), 'count', false);
      validateMongooseId(before_id, 'before_id', false);
      validateMongooseId(after_id, 'after_id', false);
      validateNumber(page_size, 1, 50, 'page_size', false);
      validateString(search, 0, 30, 'search', false);
    } catch (err) {
      return res.badRequest(err.message);
    }

    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // If after_id is provided only include topics posted after after_id
    if (after_id) {
      query._id = { $gt: after_id };
    } else if (before_id) {
      query._id = { $lt: before_id };
    }

    let topicsArray = await Topic.find(query)
      .sort({ _id: 'descending' })
      .limit(page_size)
      .select('name')
      .lean();

    if (stringToBoolean(count)) {
      const topicsWithQuestions = await Question.aggregate([
        {
          $unwind: '$topics',
        },
        {
          $group: {
            _id: '$topics',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            question_count: '$count',
          },
        },
        {
          $sort: { question_count: -1 },
        },
      ]);

      topicsArray = topicsArray.map((topic) => {
        const moreTopicInfo = topicsWithQuestions.find((_topic) => _topic.name === topic.name);
        const questionCount = moreTopicInfo ? moreTopicInfo.question_count : 0;
        return { ...topic, question_count: questionCount };
      });
    }

    // Adding if user follows the topic info
    const topicsFollowedByUser = user?.followed_topics ?? [];
    topicsArray = topicsArray.map((topic) => {
      const doesUserFollowTopic = topicsFollowedByUser.includes(topic.name);
      return { ...topic, followed_by_user: doesUserFollowTopic };
    });

    res.status(200).json({
      msg: 'Topics Found',
      data: { topics: topicsArray },
    });
  };

  followTopic = async (req, res) => {
    const { user } = req;
    const { topics } = req.body;

    // Validating request body
    try {
      validateStringArray(topics, 2, 30, 'topics', 1, 100, true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    // Checking if all provided topics are valid
    const topicInDBCount = await Topic.countDocuments({ name: { $in: topics } });
    if (topicInDBCount !== topics.length) {
      return res.badRequest('Some or all topics provided does not exist');
    }

    // Creating new followed topics list
    const newUserFollowedTopics = [...user.followed_topics, ...topics];

    // Removing duplicates from list
    user.followed_topics = [...new Set(newUserFollowedTopics)];

    try {
      await user.save();
    } catch (err) {
      return res.internalServerError("Couldn't update followed topics");
    }

    res.status(200).json({ msg: 'Updated followed topics successfully' });
  };

  unFollowTopic = async (req, res) => {
    const { user } = req;
    const { topics: topicsToUnfollow } = req.body;

    // Validating request body
    try {
      validateStringArray(topicsToUnfollow, 2, 30, 'topics', 1, 100, true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    // Removing the topics from user followed list
    user.followed_topics = user.followed_topics.filter(
      (topic) => !topicsToUnfollow.includes(topic)
    );

    try {
      await user.save();
    } catch (err) {
      return res.internalServerError("Couldn't update followed topics");
    }

    res.status(200).json({ msg: 'Updated followed topics successfully' });
  };
}
