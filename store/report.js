import { compareAsc, compareDesc, parseISO } from "date-fns";
import { stopCampaign, stopCampaignAndBan } from "~/queries/admin/reports/actions/campaign.gql";
import { banUser, muteUser } from "~/queries/admin/reports/actions/user.gql";
import { resolveComment, resolveCampaign } from "~/queries/admin/reports/actions/resolve.gql";
import { approve, deny } from "~/queries/admin/requests/action.gql";
import { upgrade } from "~/queries/admin/requests/upgrade.gql";
import Vue from "vue";

export const state = () => ({
    selectedCampaign: undefined,
    selectedComment: undefined,
    selectedRequest: undefined,
    reports: undefined,
    tempAdminPass: undefined,
});

export const mutations = {
    setReport(state, reports) {
        if (reports.reason) {
            reports.reason.sort((a, b) => {
                return compareDesc(parseISO(a.created_at), parseISO(b.created_at));
            });
        }
        state.reports = reports;
    },
    setSelectedComment(state, reports) {
        state.selectedComment = reports;
    },
    setSelectedCampaign(state, reports) {
        state.selectedCampaign = reports;
    },
    setSelectedRequest(state, request) {
        state.selectedRequest = request;
    },
    setTempAdminPass(state, pass) {
        state.tempAdminPass = pass;
    },
};

export const actions = {
    async banUser({ state }) {
        if (this.$authHelper.isLoggedIn()) {
            try {
                const res = await this.app.apolloProvider.defaultClient
                    .mutate({
                        mutation: banUser,
                        variables: {
                            userId: state.selectedComment.user.id,
                        },
                    })
                    .then(({ data }) => data && data.update_by_pk_user);

                if (res) {
                    try {
                        const var2 = await this.app.apolloProvider.defaultClient
                            .mutate({
                                mutation: resolveComment,
                                variables: {
                                    investigatorId: localStorage.userId,
                                    commentId: state.selectedComment.id,
                                },
                            })
                            .then(({ data }) => data && data.update_comment_report);

                        if (var2) {
                            Vue.notify({
                                title: "Success",
                                text: res.display_name + " Banned",
                                type: "success white--text",
                            });
                            this.$router.push("/admin/reports/comment");
                        } else {
                            Vue.notify({
                                title: "Error",
                                text: "Error: User Not Banned",
                                type: "error white--text",
                            });
                        }
                    } catch (err) {
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
                }
            } catch (err) {
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

    async muteUser({ state }) {
        if (this.$authHelper.isLoggedIn()) {
            try {
                const res = await this.app.apolloProvider.defaultClient
                    .mutate({
                        mutation: muteUser,
                        variables: {
                            userId: state.selectedComment.user.id,
                        },
                    })
                    .then(({ data }) => data && data.update_by_pk_user);

                if (res) {
                    try {
                        const var2 = await this.app.apolloProvider.defaultClient
                            .mutate({
                                mutation: resolveComment,
                                variables: {
                                    investigatorId: localStorage.userId,
                                    commentId: state.selectedComment.id,
                                },
                            })
                            .then(({ data }) => data && data.update_comment_report);

                        if (var2) {
                            Vue.notify({
                                title: "Success",
                                text: res.display_name + " Muted",
                                type: "success white--text",
                            });
                            this.$router.push("/admin/reports/comment");
                        } else {
                            Vue.notify({
                                title: "Error",
                                text: "Error: User Not Banned",
                                type: "error white--text",
                            });
                        }
                    } catch (err) {
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
                }
            } catch (err) {
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

    async doNothingCo({ state }) {
        if (this.$authHelper.isLoggedIn()) {
            try {
                const res = await this.app.apolloProvider.defaultClient
                    .mutate({
                        mutation: resolveComment,
                        variables: {
                            investigatorId: localStorage.userId,
                            commentId: state.selectedComment.id,
                        },
                    })
                    .then(({ data }) => data && data.update_comment_report);

                if (res) {
                    Vue.notify({
                        title: "Success",
                        text: "Report Resolved",
                        type: "success white--text",
                    });
                    this.$router.push("/admin/reports/comment");
                } else {
                    Vue.notify({
                        title: "Error",
                        text: "Error: Report not resolved",
                        type: "error white--text",
                    });
                }
            } catch (err) {
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

    async stopCampaign({ state }) {
        if (this.$authHelper.isLoggedIn()) {
            try {
                const res = await this.app.apolloProvider.defaultClient
                    .mutate({
                        mutation: stopCampaign,
                        variables: {
                            campaignId: state.selectedCampaign.id,
                            adminPass: state.tempAdminPass,
                            investigatorId: localStorage.userId,
                        },
                    })
                    .then(({ data }) => data);

                if (res) {
                    Vue.notify({
                        title: "Success",
                        text: "Campaign Stopped",
                        type: "success white--text",
                    });
                    this.$router.push("/admin/reports/campaign");
                } else {
                    Vue.notify({
                        title: "Error",
                        text: "Error: Campaign not stopped",
                        type: "error white--text",
                    });
                }
            } catch (err) {
                if (err.message.startsWith("GraphQL error: ")) {
                    Vue.notify({
                        title: "Error",
                        text: err.message.substring(15),
                        type: "error white--text",
                    });
                } else {
                    console.error(err.message);
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

    async stopCampaignAndBan({ state }) {
        if (this.$authHelper.isLoggedIn()) {
            try {
                const res = await this.app.apolloProvider.defaultClient
                    .mutate({
                        mutation: stopCampaignAndBan,
                        variables: {
                            campaignId: state.selectedCampaign.id,
                            adminPass: state.tempAdminPass,
                            investigatorId: localStorage.userId,
                        },
                    })
                    .then(({ data }) => data);

                if (res) {
                    Vue.notify({
                        title: "Success",
                        text: "Campaign Stopped and User Banned",
                        type: "success white--text",
                    });
                    this.$router.push("/admin/reports/campaign");
                } else {
                    Vue.notify({
                        title: "Error",
                        text: "Error: Campaign not stopped && banned",
                        type: "error white--text",
                    });
                }
            } catch (err) {
                if (err.message.startsWith("GraphQL error: ")) {
                    Vue.notify({
                        title: "Error",
                        text: err.message.substring(15),
                        type: "error white--text",
                    });
                } else {
                    console.error(err.message);
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

    async doNothingCa({ state }) {
        if (this.$authHelper.isLoggedIn()) {
            try {
                const res = await this.app.apolloProvider.defaultClient
                    .mutate({
                        mutation: resolveCampaign,
                        variables: {
                            investigatorId: localStorage.userId,
                            campaignId: state.selectedCampaign.id,
                        },
                    })
                    .then(({ data }) => data && data.update_campaign_report);

                if (res) {
                    Vue.notify({
                        title: "Success",
                        text: "Report Resolved",
                        type: "success white--text",
                    });
                    this.$router.push("/admin/reports/campaign");
                } else {
                    Vue.notify({
                        title: "Error",
                        text: "Error: Report not resolved",
                        type: "error white--text",
                    });
                }
            } catch (err) {
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

    async approveRequest({ state }) {
        if (this.$authHelper.isLoggedIn()) {
            try {
                const res = await this.app.apolloProvider.defaultClient
                    .mutate({
                        mutation: upgrade,
                        variables: {
                            userId: state.selectedRequest,
                        },
                    })
                    .then(({ data }) => data && data.update_user);

                if (res) {
                    try {
                        const var2 = await this.app.apolloProvider.defaultClient
                            .mutate({
                                mutation: approve,
                                variables: {
                                    handlerId: localStorage.userId,
                                    userId: state.selectedRequest,
                                },
                            })
                            .then(({ data }) => data && data.update_creator_request);

                        if (var2) {
                            Vue.notify({
                                title: "Success",
                                text: "User upgraded to creator.",
                                type: "success white--text",
                            });
                            this.$router.go();
                        } else {
                            Vue.notify({
                                title: "Error",
                                text: "Error: Nothing happened.",
                                type: "error white--text",
                            });
                        }
                    } catch (err) {
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
                }
            } catch (err) {
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

    async denyRequest({ state }) {
        if (this.$authHelper.isLoggedIn()) {
            try {
                const res = await this.app.apolloProvider.defaultClient
                    .mutate({
                        mutation: deny,
                        variables: {
                            userId: state.selectedRequest,
                            handlerId: localStorage.userId,
                        },
                    })
                    .then(({ data }) => data && data.update_creator_request);

                if (res) {
                    Vue.notify({
                        title: "Success",
                        text: "User denied creator status.",
                        type: "success white--text",
                    });
                    this.$router.go();
                } else {
                    Vue.notify({
                        title: "Error",
                        text: "Error: Nothing happened.",
                        type: "error white--text",
                    });
                }
            } catch (err) {
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
};