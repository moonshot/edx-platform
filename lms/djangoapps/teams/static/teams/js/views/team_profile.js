/**
 * View for an individual team.
 */
;(function (define) {
    'use strict';
    define(['backbone', 'underscore', 'gettext', 'teams/js/views/team_discussion',
            'text!teams/templates/team-profile.underscore'],
        function (Backbone, _, gettext, TeamDiscussionView, team_template) {
            var TeamProfileView = Backbone.View.extend({
                initialize: function (options) {
                    // TODO: use a team model once that code merges
                    this.courseId = options.courseId;
                    this.discussionId = "7065c53dcac4fe469fb66997da075f9af7e760a9";
                },

                render: function () {
                    this.$el.html(_.template(team_template, {
                        courseId: this.courseId,
                        discussionId: this.discussionId
                    }));
                    this.discussionView = new TeamDiscussionView({
                        el: this.$('.discussion-module')
                    });
                    this.discussionView.render();
                    return this;
                }
            });

            return TeamProfileView;
        });
}).call(this, define || RequireJS.define);
