#!/usr/bin/env python
# -*- coding: utf-8 -*-

import cgi
import json
import logging
from datetime import datetime

from handlers.base import BaseHandler, user_required
from models.topic import Topic
from models.comment import Comment


def utc2jst(utc):
    import pytz
    utc = pytz.utc.localize(utc)
    return utc.astimezone(pytz.timezone('Asia/Tokyo'))


class RequestHandler(BaseHandler):
    def comment_to_dict(self, comment):
        return {
            'id': comment.key.id(),
            'author_id': comment.author_key.id(),
            'author_name': comment.author_key.get().name,
            'author_image_url': comment.author_key.get().image_url,
            'body': comment.body,
            'created': datetime.strftime(
                utc2jst(comment.created), '%Y-%m-%d %H:%M:%S'),
            'updated': datetime.strftime(
                utc2jst(comment.updated), '%Y-%m-%d %H:%M:%S'),
        }

    def get(self, topic_id):
        topic = Topic.get_by_id(int(topic_id))

        query = Comment.query()
        query = query.filter(Comment.topic_key == topic.key)
        query = query.filter(Comment.deleted == False)
        query = query.order(Comment.created)
        comments = query.fetch()

        json_data = json.dumps(
            [self.comment_to_dict(comment) for comment in comments],
            ensure_ascii=False)

        self.response_json(json_data)

    @user_required
    def post(self, topic_id):
        topic = Topic.get_by_id(int(topic_id))

        jwt_token = self.get_jwt_token()
        payload = self.decode_jwt_token(jwt_token)
        user_id = payload.get('user_id')
        user = self.user_model.get_by_id(user_id)

        json_data = self.request.body
        form_values = json.loads(json_data)

        comment_key = Comment(
            body=cgi.escape(form_values.get('comment')),
            author_key=user.key,
            topic_key=topic.key, ).put()

        # topicのupdatedを更新するためにtopicもput()しておく
        topic.put()

        json_response = {
            'alert': 'コメントを投稿しました。',
            'id': comment_key.id(),
        }
        json_response = json.dumps(json_response)

        self.response_json(json_response)
