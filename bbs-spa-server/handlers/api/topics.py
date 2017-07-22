#!/usr/bin/env python
# -*- coding: utf-8 -*-

import cgi
import json
import logging
from datetime import datetime

from handlers.base import BaseHandler, user_required
from models.topic import Topic


def utc2jst(utc):
    import pytz
    utc = pytz.utc.localize(utc)
    return utc.astimezone(pytz.timezone('Asia/Tokyo'))


class RequestHandler(BaseHandler):
    def topic_to_dict(self, topic):
        logging.info(topic)
        return {
            'id': topic.key.id(),
            'author_id': topic.author_key.id(),
            'author_name': topic.author_key.get().name,
            'author_image_url': topic.author_key.get().image_url,
            'title': topic.title,
            'body': topic.body,
            'created': datetime.strftime(
                utc2jst(topic.created), '%Y-%m-%d %H:%M:%S'),
            'updated': datetime.strftime(
                utc2jst(topic.updated), '%Y-%m-%d %H:%M:%S'),
        }

    def get(self, topic_id=None):
        fetch_num = 10

        offset = self.request.get('offset', '0')

        if topic_id:
            topic = Topic.get_by_id(int(topic_id))
            topic = self.topic_to_dict(topic)
            json_data = json.dumps(topic)

        else:
            offset = int(offset) * fetch_num

            query = Topic.query()
            query = query.filter(Topic.deleted == False)
            query = query.order(-Topic.updated)
            topics = query.fetch(fetch_num, offset=offset)

            json_data = json.dumps(
                [self.topic_to_dict(topic) for topic in topics],
                ensure_ascii=False)

        self.response_json(json_data)

    @user_required
    def post(self):
        jwt_token = self.get_jwt_token()
        payload = self.decode_jwt_token(jwt_token)
        user_id = payload.get('user_id')
        user = self.user_model.get_by_id(user_id)

        json_data = self.request.body
        form_values = json.loads(json_data)

        topic_key = Topic(
            title=cgi.escape(form_values.get('title')),
            body=cgi.escape(form_values.get('body')),
            author_key=user.key, ).put()

        json_response = {
            'alert': 'トピックを作成しました。',
            'id': topic_key.id(),
        }
        json_response = json.dumps(json_response)

        self.response_json(json_response)
