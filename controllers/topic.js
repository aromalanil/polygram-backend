import Topic from '../models/topic';
import Question from '../models/question';
import { stringToBoolean } from '../helpers/convertors';
import {
  validateBoolean,
  validateMongooseId,
  validateString,
  validateStringArray,
} from '../helpers/validation';

export default class TopicController {
  findSingleTopic = async (req, res) => {
    const { id } = req.params;

    // Validating request body
    try {
      validateMongooseId(id, 'id', true);
    } catch (err) {
      return res.badRequest(err.message);
    }

    // Finding topic with corresponding ID
    const topic = await Topic.findById(id).lean();

    // Checking if topic exist
    if (!topic) {
      return res.notFound('Topic does not exist');
    }

    res.status(200).json({
      msg: 'Topic Found',
      topic,
    });
  };

  findTopic = async (req, res) => {
    const { count = 'false', search } = req.query;

    // Validating request body
    try {
      validateBoolean(stringToBoolean(count), 'count', false);
      validateString(search, 0, 30, 'search', false);
    } catch (err) {
      return res.badRequest(err.message);
    }

    const query = {};
    if (search) {
      if (stringToBoolean(count)) {
        req.badRequest('Search cannot be used along with count');
      }
      query.name = { $regex: search, $options: 'i' };
    }

    let topicsArray = await Topic.find(query).select('name').lean();

    if (stringToBoolean(count)) {
      let topicsWithQuestions = await Question.aggregate([
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

      // Adding id to each topic
      topicsWithQuestions = topicsWithQuestions.map((topic) => {
        const fullTopicData = topicsArray.find((allTopic) => allTopic.name === topic.name);
        return { _id: fullTopicData._id, ...topic };
      });

      topicsArray.forEach((allTopic) => {
        const topicHasQuestions = topicsWithQuestions.find((topic) => allTopic.name === topic.name);
        if (!topicHasQuestions) {
          topicsWithQuestions.push({ ...allTopic, question_count: 0 });
        }
      });

      topicsArray = topicsWithQuestions;
    }

    res.status(200).json({
      topics: topicsArray,
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
