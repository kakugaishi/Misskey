/// <reference path="../../../typings/bundle.d.ts" />

import async = require('async');
import Application = require('../../models/application');
import User = require('../../models/user');
import UserFollowing = require('../../models/user-following');
import Post = require('../../models/post');
import Timeline = require('../utils/timeline');
import conf = require('../../config');

export = render;

var render = (req: any, res: any, content: string = 'home'): void => {
	async.series([
		(callback: any) => {
			Post.getUserPostsCount(req.me.id,(count: number) => {
				callback(null, count);
			});
		},
		(callback: any) => {
			UserFollowing.getFollowingsCount(req.me.id,(count: number) => {
				callback(null, count);
			});
		},
		(callback: any) => {
			UserFollowing.getFollowersCount(req.me.id,(count: number) => {
				callback(null, count);
			});
		},
		(callback: any) => {
			switch (content) {
				case 'home':
					Post.getTimeline(req.me.id, 30, null, null,(posts: Post[]) => {
						Timeline.generateHtml(posts,(timelineHtml: string) => {
							callback(null, timelineHtml);
						});
					});
					break;
				case 'mention':
					Post.getMentions(req.me.id, 30, null, null,(posts: Post[]) => {
						Timeline.generateHtml(posts,(timelineHtml: string) => {
							callback(null, timelineHtml);
						});
					});
					break;
			}
		}],
		(err: any, results: any) => {
			res.display(req, res, 'home', {
				postsCount: results[0],
				followingsCount: results[1],
				followersCount: results[2],
				timelineHtml: results[3],
			});
		});
};
