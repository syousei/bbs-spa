#!/usr/bin/env python
# -*- coding: utf-8 -*-

from google.appengine.ext import ndb

from models.message import Message
from models.topic import Topic


class Comment(Message):
    topic_key = ndb.KeyProperty(kind=Topic)
