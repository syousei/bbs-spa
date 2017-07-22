#!/usr/bin/env python
# -*- coding: utf-8 -*-

from google.appengine.ext import ndb

from models.message import Message


class Topic(Message):
    title = ndb.StringProperty()
    comment_keys = ndb.KeyProperty(repeated=True)
