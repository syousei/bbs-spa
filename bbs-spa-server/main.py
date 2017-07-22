#!/usr/bin/env python
# -*- coding: utf-8 -*-

import webapp2

webapp2_routes = [
    webapp2.Route(r'/verificate', 'handlers.verificate.RequestHandler',
                  'verificate'),
    webapp2.Route(r'/api/authenticate',
                  'handlers.api.authenticate.RequestHandler'),
    webapp2.Route(r'/api/users', 'handlers.api.users.RequestHandler'),
    webapp2.Route(r'/api/topics', 'handlers.api.topics.RequestHandler'),
    webapp2.Route(r'/api/topics/<topic_id:\d+>',
                  'handlers.api.topics.RequestHandler'),
    webapp2.Route(r'/api/comments',
                  'handlers.api.comments.RequestHandler'),
    webapp2.Route(r'/api/comments/<topic_id:\d+>',
                  'handlers.api.comments.RequestHandler'),
]

webapp2_config = {
    'webapp2_extras.auth': {
        'user_model': 'models.user.User',
    }
}

app = webapp2.WSGIApplication(
    routes=webapp2_routes, config=webapp2_config, debug=True)
