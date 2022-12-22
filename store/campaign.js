import Vue from "vue";
import { likeCampaign } from "~/queries/campaign/likeCampaign.gql";
import { dislikeCampaign } from "~/queries/campaign/dislikeCampaign.gql";
import {
  saveCampaign,
  saveCampaignAdmin,
} from "~/queries/campaign/saveCampaign.gql";
import { deleteSavedCampaign } from "~/queries/campaign/deleteSavedCampaign.gql";
import { backCampaign } from "~/queries/campaign/backCampaign.gql";
import { comment, commentAdmin } from "~/queries/campaign/comment.gql";
import { endCampaign } from "~/queries/campaign/endCampaign.gql";
import { setCampaignPrivacy } from "~/queries/campaign/setCampaignPrivacy.gql";
import { createCampaign } from "~/queries/campaign/createCampaign.gql";
import { editCampaign } from "~/queries/campaign/editCampaign.gql";
import { addReward } from "~/queries/campaign/addReward.gql";
import { getCampaign } from "~/queries/campaign/getCampaign.gql";
import { reportCampaign } from "~/queries/campaign/reportCampaign.gql";
import { reportComment } from "~/queries/campaign/reportComment.gql";
import { requestWithdrawal } from "~/queries/campaign/requestWithdrawal.gql";
import { compareAsc, compareDesc, parseISO } from "date-fns";

export const state = () => ({
  selected: undefined,
  sentiment: undefined,
  stats: undefined,
});

export const mutations = {
  setCampaign(state, campaign) {
    if (campaign.comments) {
      campaign.comments.sort((a, b) => {
        return compareDesc(parseISO(a.created_at), parseISO(b.created_at));
      });
    }
    if (campaign.rewards) {
      campaign.rewards.sort((a, b) => {
        if (a.pledge_amount === b.pledge_amount) return 0;
        return a.pledge_amount < b.pledge_amount ? -1 : 1;
      });
    }
    state.selected = campaign;
  },
  setSentiment(state, sentiment) {
    state.sentiment = sentiment;
  },
  setStats(state, campaignStats) {
    const currentUserRelation = campaignStats.currentUserRelation
      ? JSON.parse(campaignStats.currentUserRelation)
      : null;
    state.stats = {
      backersCount: campaignStats.backersCount,
      totalPledged: campaignStats.totalAmount,
      currentUserRelation: currentUserRelation,
    };
  },
  setCurrentUserRelation(state, currentUserRelation) {
    state.stats = {
      backersCount: state.stats.backersCount,
      totalPledged: state.stats.totalPledged,
      currentUserRelation: currentUserRelation,
    };
  },
  refreshCurrentUserLike(state, likeState) {
    state.stats.currentUserRelation.liked = likeState;
    state.stats.currentUserRelation.disliked = false;
  },
  refreshCurrentUserDislike(state, dislikeState) {
    state.stats.currentUserRelation.disliked = dislikeState;
    state.stats.currentUserRelation.liked = false;
  },
  setCampaignSaved(state, saved) {
    state.stats.currentUserRelation.saved = saved;
  },
  clear(state) {
    state.selected = state.sentiment = state.stats = undefined;
  },
  addPledge(state, amount, pledgeId) {
    state.stats.totalPledged += Math.abs(amount);
    state.stats.currentUserRelation.pledge = {
      exists: true,
      id: pledgeId,
    };
  },
  addComment(state, comment) {
    state.selected.comments.push(comment);
    state.selected.comments.sort((a, b) => {
      return compareDesc(parseISO(a.created_at), parseISO(b.created_at));
    });
  },
  endCampaign(state, status) {
    state.selected.is_ended = true;
    state.selected.end_status = status;
  },
  setPrivacy(state, isPrivate) {
    state.selected.is_private = isPrivate;
  },
  addReward(state, reward) {
    state.selected.rewards.push(reward);
    state.selected.rewards.sort((a, b) => {
      if (a.pledge_amount === b.pledge_amount) return 0;
      return a.pledge_amount < b.pledge_amount ? -1 : 1;
    });
  },
};

export const actions = {
  async fetch({ commit, state }, campaignId) {
    try {
      const res = await this.app.apolloProvider.defaultClient
        .query({
          query: getCampaign,
          variables: {
            campaignId: campaignId,
          },
        })
        .then(({ data }) => data && data.campaign_by_pk);
      if (res.id) {
        commit("setCampaign", res);
        return true;
      } else {
        Vue.notify({
          titile: "Error",
          text: "Unable to fetch campaign",
          type: "error white--text",
        });
        return false;
      }
    } catch (err) {
      console.log(err);
      if (err.message.startsWith("GraphQL error: ")) {
        Vue.notify({
          title: "Error",
          text: err.message.substring(15),
          type: "error white--text",
        });
      } else {
        Vue.notify({
          title: "Critical Error",
          text: "Connection error or invalid state detected",
          type: "error white--text",
        });
      }
      return false;
    }
  },
  async like({ commit, state }) {
    if (this.$authHelper.isLoggedIn()) {
      try {
        const res = await this.app.apolloProvider.defaultClient
          .mutate({
            mutation: likeCampaign,
            variables: {
              campaignId: state.selected.id,
            },
          })
          .then(({ data }) => data && data.campaignLike);

        commit("setSentiment", {
          likes: res.likesCount,
          dislikes: res.dislikesCount,
        });
        commit("refreshCurrentUserLike", res.liked);
      } catch (err) {
        console.log(err);
        if (err.message.startsWith("GraphQL error: ")) {
          Vue.notify({
            title: "Error",
            text: err.message.substring(15),
            type: "error white--text",
          });
        } else {
          Vue.notify({
            title: "Critical Error",
            text: "Connection error or invalid state detected",
            type: "error white--text",
          });
        }
      }
    } else {
      this.$router.push("/auth/login");
    }
  },
  async dislike({ commit, state }) {
    if (this.$authHelper.isLoggedIn()) {
      try {
        const res = await this.app.apolloProvider.defaultClient
          .mutate({
            mutation: dislikeCampaign,
            variables: {
              campaignId: state.selected.id,
            },
          })
          .then(({ data }) => data && data.campaignDislike);

        commit("setSentiment", {
          likes: res.likesCount,
          dislikes: res.dislikesCount,
        });
        commit("refreshCurrentUserDislike", res.disliked);
      } catch (err) {
        console.log(err);
        if (err.message.startsWith("GraphQL error: ")) {
          Vue.notify({
            title: "Error",
            text: err.message.substring(15),
            type: "error white--text",
          });
        } else {
          Vue.notify({
            title: "Critical Error",
            text: "Connection error or invalid state detected",
            type: "error white--text",
          });
        }
      }
    } else {
      this.$router.push("/auth/login");
    }
  },
  async save({ commit, state }) {
    if (this.$authHelper.isLoggedIn()) {
      // console.log("saved " + state.stats.currentUserRelation.saved);
      const isAdmin = this.$authHelper.getUserInfo().role === "admin";
      const saveQuery = isAdmin ? saveCampaignAdmin : saveCampaign;
      const saveVariables = isAdmin
        ? {
            campaignId: state.selected.id,
            userId: this.$authHelper.getUserInfo().id,
          }
        : { campaignId: state.selected.id };

      try {
        // Unsave(?) campaign
        if (state.stats.currentUserRelation.saved) {
          const res = await this.app.apolloProvider.defaultClient
            .mutate({
              mutation: deleteSavedCampaign,
              variables: {
                campaignId: state.selected.id,
                userId: this.$authHelper.getUserInfo().id,
              },
            })
            .then(({ data }) => data && data.delete_by_pk_saved_campaign);
          if (res.campaign_id) {
            commit("setCampaignSaved", false);
            Vue.notify({
              text: "Removed",
              type: "reversebackground reverseforeground--text text-center",
            });
          }
        }
        // Save campaign
        else {
          const res = await this.app.apolloProvider.defaultClient
            .mutate({
              mutation: saveQuery,
              variables: saveVariables,
            })
            .then(({ data }) => data && data.insert_saved_campaign_one);
          if (res.created_at) {
            commit("setCampaignSaved", true);
            Vue.notify({
              text: "Saved",
              type: "reversebackground reverseforeground--text text-center",
            });
          }
        }
      } catch (err) {
        console.log(err);
        if (err.message.startsWith("GraphQL error: ")) {
          Vue.notify({
            title: "Error",
            text: err.message.substring(15),
            type: "error white--text",
          });
        } else {
          Vue.notify({
            title: "Critical Error",
            text: "Connection error or invalid state detected",
            type: "error white--text",
          });
        }
      }
    } else {
      this.$router.push("/auth/login");
    }
  },
  async back({ commit, state }, { amount, acceptRewards = true }) {
    if (
      this.$authHelper.isLoggedIn()
      // && this.$authHelper.getUserInfo().role === "user"
    ) {
      try {
        const res = await this.app.apolloProvider.defaultClient
          .mutate({
            mutation: backCampaign,
            variables: {
              campaignId: state.selected.id,
              amount: amount,
              acceptRewards: acceptRewards,
            },
          })
          .then(({ data }) => data && data.backCampaign);
        if (res.pledgeId) {
          Vue.notify({
            title: "Thank You!",
            text: `You have successfuly pledged ${Math.abs(amount)} Br`,
            type: "success white--text",
          });
          commit("addPledge", amount, res.pledgeId);
        } else {
          Vue.notify({
            title: "Error",
            text: "Unable to complete pledge",
            type: "error white--text",
          });
        }
      } catch (err) {
        console.log(err);
        if (err.message.startsWith("GraphQL error: ")) {
          Vue.notify({
            title: "Error",
            text: err.message.substring(15),
            type: "error white--text",
          });
        } else {
          Vue.notify({
            title: "Critical Error",
            text: "Connection error or invalid state detected",
            type: "error white--text",
          });
        }
      }
    } else {
      this.$router.push("/auth/login");
    }
  },
  async comment({ commit, state }, content) {
    if (this.$authHelper.isLoggedIn()) {
      const isAdmin = this.$authHelper.getUserInfo().role === "admin";
      const commentQuery = isAdmin ? commentAdmin : comment;
      const commentVariables = isAdmin
        ? {
            campaignId: state.selected.id,
            userId: this.$authHelper.getUserInfo().id,
            text: content,
          }
        : { campaignId: state.selected.id, text: content };

      try {
        const res = await this.app.apolloProvider.defaultClient
          .mutate({
            mutation: commentQuery,
            variables: commentVariables,
          })
          .then(({ data }) => data && data.insert_comment_one);
        if (res.id) {
          const currentUser = this.$authHelper.getUserInfo();
          console.log(currentUser.avatarUrl === null);
          commit("addComment", {
            id: res.id,
            text: res.text,
            user: {
              id: currentUser.id,
              avatar:
                currentUser.avatarUrl === "null" ? null : currentUser.avatarUrl,
              display_name: currentUser.displayName,
              role: currentUser.role,
            },
            created_at: res.created_at,
            updated_at: res.updated_at,
          });
          Vue.notify({
            text: "Comment Saved",
            type: "reversebackground reverseforeground--text text-center",
          });
        } else {
          Vue.notify({
            title: "Error",
            text: "Unable to save comment",
            type: "error white--text text-center",
          });
        }
      } catch (err) {
        console.log(err);
        if (err.message.startsWith("GraphQL error: ")) {
          Vue.notify({
            title: "Error",
            text: err.message.substring(15),
            type: "error white--text",
          });
        } else {
          Vue.notify({
            title: "Critical Error",
            text: "Connection error or invalid state detected",
            type: "error white--text",
          });
        }
      }
    } else {
      this.$router.push("/auth/login");
    }
  },
  async end({ commit, state }, endVariables) {
    if (this.$authHelper.isLoggedIn()) {
      try {
        const { status, password } = endVariables;
        const res = await this.app.apolloProvider.defaultClient
          .mutate({
            mutation: endCampaign,
            variables: {
              campaignId: state.selected.id,
              status: status,
              password: password,
            },
          })
          .then(({ data }) => data && data.endCampaign);
        if (res.campaignId && res.endStatus) {
          commit("endCampaign", status);
          Vue.notify({
            text: "Campaign successfuly ended",
            type: "success white--text",
          });
        } else {
          Vue.notify({
            title: "Error",
            text: "Unable to end campaign",
            type: "error white-text",
          });
        }
      } catch (err) {
        console.log(err);
        if (err.message.startsWith("GraphQL error: ")) {
          Vue.notify({
            title: "Error",
            text: err.message.substring(15),
            type: "error white--text",
          });
        } else {
          Vue.notify({
            title: "Critical Error",
            text: "Connection error or invalid state detected",
            type: "error white--text",
          });
        }
      }
    } else {
      this.$router.push("/auth/login");
    }
  },
  async setPrivacy({ commit, state }, isPrivate) {
    if (this.$authHelper.isLoggedIn()) {
      try {
        if (isPrivate === true || isPrivate === false) {
          const res = await this.app.apolloProvider.defaultClient
            .mutate({
              mutation: setCampaignPrivacy,
              variables: {
                campaignId: state.selected.id,
                isPrivate: isPrivate,
              },
            })
            .then(({ data }) => data && data.campaign);
          if (res.id) {
            commit("setPrivacy", isPrivate);
            Vue.notify({
              text: `Campaign set to ${isPrivate ? "Private" : "Public"}`,
              type: "reversebackground reverseforeground--text",
            });
          }
        } else {
          Vue.notify({
            title: "Error",
            text: 'Parameter "isPrivate" needs to be defined',
            type: "error white--text",
          });
        }
      } catch (err) {
        console.log(err);
        if (err.message.startsWith("GraphQL error: ")) {
          Vue.notify({
            title: "Error",
            text: err.message.substring(15),
            type: "error white--text",
          });
        } else {
          Vue.notify({
            title: "Critical Error",
            text: "Connection error or invalid state detected",
            type: "error white--text",
          });
        }
      }
    } else {
      this.$router.push("/auth/login");
    }
  },
  async create(_, campaign) {
    if (this.$authHelper.isLoggedIn()) {
      try {
        if (this.$authHelper.getUserInfo().role === "creator") {
          const res = await this.app.apolloProvider.defaultClient
            .mutate({
              mutation: createCampaign,
              variables: campaign,
            })
            .then(({ data }) => data && data.campaign);
          if (res.id) {
            Vue.notify({
              text: "Campaign created",
              type: "success white--text",
            });
            // this.$router.push(`/campaign/${res.id}`);
            return res.id;
          } else {
            Vue.notify({
              title: "Error",
              text: "Unable to create campaign",
              type: "error white--text",
            });
          }
        } else {
          Vue.notify({
            title: "Error",
            text: "Permission denied. Non-creators can not start campaigns",
            type: "error white--text",
          });
        }
        return false;
      } catch (err) {
        console.log(err);
        if (err.message.startsWith("GraphQL error: ")) {
          Vue.notify({
            title: "Error",
            text: err.message.substring(15),
            type: "error white--text",
          });
        } else {
          Vue.notify({
            title: "Critical Error",
            text: "Connection error or invalid state detected",
            type: "error white--text",
          });
        }
      }
    } else {
      this.$router.push("/auth/login");
    }
  },
  async edit(_, campaign) {
    if (this.$authHelper.isLoggedIn()) {
      try {
        if (this.$authHelper.getUserInfo().role === "creator") {
          const res = await this.app.apolloProvider.defaultClient
            .mutate({
              mutation: editCampaign,
              variables: campaign,
            })
            .then(({ data }) => data && data.campaign);
          if (res.id) {
            Vue.notify({
              text: "Changes saved",
              type: "success white--text",
            });
            this.$router.push(`/campaign/${res.id}`);
          } else {
            Vue.notify({
              title: "Error",
              text: "Unable to create campaign",
              type: "error white--text",
            });
          }
        } else {
          Vue.notify({
            title: "Error",
            text: "Permission denied. Only a campaign's creators are allowed to make changes",
            type: "error white--text",
          });
        }
      } catch (err) {
        console.log(err);
        if (err.message.startsWith("GraphQL error: ")) {
          Vue.notify({
            title: "Error",
            text: err.message.substring(15),
            type: "error white--text",
          });
        } else {
          Vue.notify({
            title: "Critical Error",
            text: "Connection error or invalid state detected",
            type: "error white--text",
          });
        }
      }
    } else {
      this.$router.push("/auth/login");
    }
  },
  async addReward({ commit, state }, reward) {
    if (this.$authHelper.isLoggedIn()) {
      try {
        if (this.$authHelper.getUserInfo().role === "creator") {
          const res = await this.app.apolloProvider.defaultClient
            .mutate({
              mutation: addReward,
              variables: reward,
            })
            .then(({ data }) => data && data.reward);
          if (res.id) {
            commit("addReward", res);
            Vue.notify({
              text: "Reward added",
              type: "success white--text",
            });
            return true;
          } else {
            Vue.notify({
              title: "Error",
              text: "Unable to add reward",
              type: "error white--text",
            });
            return true;
          }
        } else {
          Vue.notify({
            title: "Error",
            text: "Permission denied. Only a campaign's creators are allowed to make changes",
            type: "error white--text",
          });
        }
      } catch (err) {
        console.log(err);
        if (err.message.startsWith("GraphQL error: ")) {
          Vue.notify({
            title: "Error",
            text: err.message.substring(15),
            type: "error white--text",
          });
        } else {
          Vue.notify({
            title: "Critical Error",
            text: "Connection error or invalid state detected",
            type: "error white--text",
          });
        }
      }
      return true;
    } else {
      this.$router.push("/auth/login");
    }
  },
  async report({ commit, state }, reason) {
    if (this.$authHelper.isLoggedIn()) {
      try {
        const res = await this.app.apolloProvider.defaultClient
          .mutate({
            mutation: reportCampaign,
            variables: {
              campaignId: state.selected.id,
              reason: reason,
            },
          })
          .then(({ data }) => data && data.campaignReport);
        if (res.affected_rows) {
          Vue.notify({
            text: "Campaign Reported",
            type: "reversebackground reverseforeground--text",
          });
        } else {
          Vue.notify({
            title: "Error",
            text: "Unable to report campaign",
            type: "error white--text",
          });
        }
      } catch (err) {
        console.log(err);
        if (err.message.startsWith("GraphQL error: ")) {
          let message = "";
          if (err.message.substring(15).startsWith("Uniqueness violation")) {
            message = "Already reported";
          } else {
            message = err.message.substring(15);
          }
          Vue.notify({
            title: "Error",
            text: message,
            type: "error white--text",
          });
        } else {
          Vue.notify({
            title: "Critical Error",
            text: "Connection error or invalid state detected",
            type: "error white--text",
          });
        }
      }
    } else {
      this.$router.push("/auth/login");
    }
  },
  async reportComment({ commit, state }, commentReport) {
    if (this.$authHelper.isLoggedIn()) {
      try {
        const res = await this.app.apolloProvider.defaultClient
          .mutate({
            mutation: reportComment,
            variables: commentReport,
          })
          .then(({ data }) => data && data.commentReport);
        if (res.affected_rows) {
          Vue.notify({
            text: "Comment Reported",
            type: "reversebackground reverseforeground--text",
          });
        } else {
          Vue.notify({
            title: "Error",
            text: "Unable to report comment",
            type: "error white--text",
          });
        }
      } catch (err) {
        console.log(err);
        if (err.message.startsWith("GraphQL error: ")) {
          let message = "";
          if (err.message.substring(15).startsWith("Uniqueness violation")) {
            message = "Already reported";
          } else {
            message = err.message.substring(15);
          }
          Vue.notify({
            title: "Error",
            text: message,
            type: "error white--text",
          });
        } else {
          Vue.notify({
            title: "Critical Error",
            text: "Connection error or invalid state detected",
            type: "error white--text",
          });
        }
      }
    } else {
      this.$router.push("/auth/login");
    }
  },
  async requestWithdrawal({ commit, state }, password) {
    if (this.$authHelper.isLoggedIn()) {
      try {
        const res = await this.app.apolloProvider.defaultClient
          .mutate({
            mutation: requestWithdrawal,
            variables: {
              campaignId: state.selected.id,
              password: password,
            },
          })
          .then(({ data }) => data && data.requestWithdrawal);
        if (res.id) {
          Vue.notify({
            title: "Success",
            text: "Withdrawal requested",
            type: "success white--text",
          });
          return {
            id: res.id,
            campaignId: res.campaignId,
            createdAt: res.createdAt,
            status: res.status,
            updatedAt: res.updatedAt,
          };
        } else {
          Vue.notify({
            title: "Error",
            text: "Unable to make withdrawal request",
            type: "error white--text",
          });
          return false;
        }
      } catch (err) {
        console.log(err);
        if (err.message.startsWith("GraphQL error: ")) {
          Vue.notify({
            title: "Error",
            text: err.message.substring(15),
            type: "error white--text",
          });
        } else {
          Vue.notify({
            title: "Critical Error",
            text: "Connection error or invalid state detected",
            type: "error white--text",
          });
        }
        return false;
      }
    } else {
      this.$router.push("/auth/login");
    }
  },
};
