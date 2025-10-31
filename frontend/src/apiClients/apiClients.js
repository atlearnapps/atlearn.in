import axios from "axios";
import config from "src/config";

class ApiClient {
  constructor(
    configBaseURL
    // authProvider = isValidJson(token)
  ) {
    this.http = axios.create({
      baseURL: configBaseURL,
      timeout: 200000,
      headers: {
        "x-uh-os": "web",
        "x-requested-with": "axios-AuthApiClient",
      },
    });
    this.http.interceptors.request.use((config) => {
      const token = localStorage.getItem("access_token") || "";
      config.headers = {
        ...config.headers,
        authorization: `Bearer ${isValidJson(token)}`,
      };
      return config;
    });
  }

  //bigbluebutton

  async startMeeting(friendlyId) {
    return (await this.http.post(`/api/bbb/start/${friendlyId}`)).data;
  }
  async joinMeeting(friendlyId, data) {
    return (await this.http.post(`/api/bbb/join/${friendlyId}`, data)).data;
  }
  async endMeeting(friendlyId) {
    return (await this.http.get(`/api/bbb/end/${friendlyId}`)).data;
  }
  async roomRecord(friendlyId) {
    return (await this.http.get(`/api/bbb/record/${friendlyId}`)).data;
  }
  async deleteRecord(id) {
    return (await this.http.delete(`/api/bbb/record/${id}`)).data;
  }
  async userRecords(id) {
    return (await this.http.get(`/api/bbb/user_records/${id}`)).data;
  }

  //Zoom

  async startZoomMeeting(friendlyId) {
    return (await this.http.get(`/api/zoom/start-meeting/${friendlyId}`)).data;
  }
  async joinZoomMeeting(friendlyId,data) {
    return (await this.http.post(`/api/zoom/join-meeting/${friendlyId}`, data)).data;
  }

  // users

  async singup(singupData) {
    return (await this.http.post("/api/user", singupData)).data;
  }

  async login(loginData) {
    return (await this.http.post("/api/user/login", loginData)).data;
  }

  async getAllNewUsers() {
    return (await this.http.get("/api/user/getAll")).data;
  }

  async userUpdate(data, userId) {
    return (await this.http.put(`/api/user/update/${userId}`, data)).data;
  }
  async userUpdateProfile(data){
    return (await this.http.post(`/api/user/update_profile/`, data)).data;

  }
  
  async createUser(data) {
    return (await this.http.post("/api/user/create", data)).data;
  }
  async deleteUser(userId) {
    return (await this.http.delete(`/api/user/remove/${userId}`)).data;
  }
  async bannedUsers() {
    return (await this.http.get("/api/user/banned")).data;
  }
  async pendingUsers() {
    return (await this.http.get("/api/user/pending_user")).data;
  }
  async changePassword(userId, data) {
    return (await this.http.post(`/api/user/change_password/${userId}`, data))
      .data;
  }
  async verifyEmail(token) {
    return (await this.http.get(`/api/user/verifyemail/${token}`)).data;
  }

  async uploadProfile(id, data) {
    return (await this.http.post(`/api/user/uploadProfile/${id}`, data)).data;
  }
  async deleteProfile(id) {
    return (await this.http.delete(`/api/user/delete_profile/${id}`)).data;
  }
  async forgotPassword(data) {
    return (await this.http.post("/api/user/forgetpassword", data)).data;
  }
  async resetPassword(id, data) {
    return (await this.http.post(`/api/user/restpassword/${id}`, data)).data;
  }
  async getTransaction() {
    return (await this.http.get("/api/user/transaction_details")).data;
  }
  async inviteUser(data) {
    return (await this.http.post("/api/user/invite_user", data)).data;
  }
  async verifyInviteUser(id) {
    return (await this.http.get(`/api/user/verify_invite_user/${id}`)).data;
  }

  async changePlan(data) {
    return (await this.http.post("/api/user/change-plan", data)).data;
  }
  async expiredPlan() {
    return (await this.http.get("/api/user/expired-plan")).data;
  }
  async addBankDetails(data) {
    return (await this.http.post(`/api/user/add_bank_details`, data)).data;
  }
  async allTeachers(){
    return (await this.http.get("/api/user/all-teachers")).data
  }
  //oauth Credentilas

  async getCredentials(){
    return (await this.http.get("/api/oauth/get-credential")).data
  }
  async generateClient(){
    return (await this.http.post("/api/oauth/generate")).data
  }
  async generateOauthToken(data){
    return (await this.http.post("/api/oauth/generate-token",data)).data
  }
  async regenerateSecret(){
    return (await this.http.put("/api/oauth/regenerate-secret")).data
  }
  async revokeCredentials(){
    return (await this.http.delete("/api/oauth/revoke")).data
  }

  // roles

  async createRoles(Roles) {
    return (await this.http.post("/api/user/roles/add", Roles)).data;
  }
  async getAllRoles() {
    return (await this.http.get("/api/user/roles/getAll")).data;
  }
  async getOneRole(roleId) {
    return (await this.http.get(`/api/user/${roleId}`)).data;
  }
  async deleteRole(roleId) {
    return (await this.http.delete(`/api/user/roles/remove/${roleId}`)).data;
  }
  async updateRole(roleId, data) {
    return (await this.http.patch(`/api/user/roles/update/${roleId}`, data))
      .data;
  }
  async addRole(data) {
    return (await this.http.post("/api/user/add-role",data)).data;
  }

  //role_permission

  async getRole_Permission_ById(roleId) {
    return (await this.http.get(`/api/role_permission/get/${roleId}`)).data;
  }
  async updateRole_Permission(data) {
    return (await this.http.put("/api/role_permission/update", data)).data;
  }

  // room Configuration

  async getAllRoomConfig() {
    return (await this.http.get("/api/room_configuration/getAll")).data;
  }
  async updateRoomCnfig(roomConfigId, data) {
    return (
      await this.http.put(
        `/api/room_configuration/update/${roomConfigId}`,
        data
      )
    ).data;
  }

  // site Settings

  async getSiteSettings(data) {
    return (await this.http.post("/api/site_settings/get", data)).data;
  }
  async updateSiteSettings(siteId, data) {
    return (await this.http.put(`/api/site_settings/update/${siteId}`, data))
      .data;
  }
  async deleteSiteSettings(siteId) {
    return (await this.http.put(`/api/site_settings/delete/${siteId}`)).data;
  }

  // Room

  async createRooms(data) {
    return (await this.http.post("/api/room/create", data)).data;
  }
  async getRooms() {
    return (await this.http.get("/api/room/getAllRooms")).data;
  }
  async updateRoom(data) {
    return (await this.http.patch("/api/room/update", data)).data;
  }
  async removeRoom(roomId) {
    return (await this.http.delete(`/api/room/remove/${roomId}`)).data;
  }
  async getOneRoom(roomId) {
    return (await this.http.get(`/api/room/getsingleRoom/${roomId}`)).data;
  }
  async allRoomSetting(roomId) {
    return (await this.http.get(`/api/room/settings/getAll/${roomId}`)).data;
  }
  async updateRoomSettings(id, data) {
    return (await this.http.patch(`/api/room/settings/update/${id}`, data))
      .data;
  }
  async generateAccessCode_Viewers(id) {
    return (await this.http.get(`/api/room/getAccessCode/${id}`)).data;
  }
  async deleteAccessCode_Viewers(id) {
    return (await this.http.delete(`/api/room/deleteAccessCode/${id}`)).data;
  }
  async getroomUser(id) {
    return (await this.http.get(`/api/room/getuserDetails/${id}`)).data;
  }
  async shareable_users(data) {
    return (await this.http.post(`/api/room/shareable_users`, data)).data;
  }
  async createSharedAccess(data) {
    return (await this.http.post("/api/room/share_access/create", data)).data;
  }
  async share_access(id) {
    return (await this.http.get(`/api/room/share_access/getAll/${id}`)).data;
  }
  async deleteShareAccess(id) {
    return (await this.http.delete(`/api/room/share_access/delete/${id}`)).data;
  }
  async getAllRooms(page, perPage, status) {
    return (
      await this.http.get(
        `/api/room/getAll?page=${page}&perPage=${perPage}&status=${status}`
      )
    ).data;
  }
  async getAllRecordings(page, perPage) {
    return (
      await this.http.get(
        `/api/bbb/recordings/getAll?page=${page}&perPage=${perPage}`
      )
    ).data;
  }
  async shareRoom(data) {
    return (await this.http.post("/api/room/share_room", data)).data;
  }
  async sheduleMeeting(data) {
    return (await this.http.post("/api/room/schedule_meeting", data)).data;
  }
  async getScheduleMeeting() {
    return (await this.http.get("/api/room/getScheduleMeeting")).data;
  }
  async getsingleScheduleMeeting(id) {
    return (await this.http.get(`/api/room/getSingleScheduleMeeting/${id}`))
      .data;
  }
  async updateScheduleMeeting(id, data) {
    return (await this.http.post(`/api/room/updateScheduleMeeting/${id}`, data))
      .data;
  }

  async feedback(data) {
    return (await this.http.post("/api/room/feedback", data)).data;
  }

  async contact(data) {
    return (await this.http.post("/api/user/contact", data)).data;
  }

  async preRecordings() {
    return (await this.http.get(`/api/room/live_room_records`)).data;
  }

  async totalCount() {
    return (await this.http.get(`/api/room/total_count`)).data;
  }
  async getScheduleMeetingNotification() {
    return (await this.http.get("/api/room/get_scheduled_notification")).data;
  }
  async updateNotificationReadStatus(data) {
    return (
      await this.http.post("/api/room/updateNotificationReadStatus", data)
    ).data;
  }
  async inviteNewUser(data) {
    return (await this.http.post("/api/room/inviteUser", data)).data;
  }
  async sheduledMeetings(data) {
    return (await this.http.get(`/api/room/getScheduledMeetingonly?filter=${data?.filter || null}&name=${data?.name || ""}&date=${data?.date || ""}&tag=${data?.tag || ""}`)).data;
  }
  async SheduledMeetingDetails(data) {
    return (await this.http.post("/api/room/scheduledMeetings", data)).data;
  }
  async checkMeetingPayment(data) {
    return (await this.http.post("/api/room/checkMeetingPayment", data)).data;
  }

  async deleteScheduleMeeting (id){
    return (await this.http.delete( `/api/room/deleteScheduleMeeting/${id}`))
  }

  async get_room_scheduled_meetings (id) {
    return(await this.http.get(`/api/room/fetch_room_scheduled_meetings/${id}`)).data;
  }

  //Notification

  async getNotification() {
    return (await this.http.get("/api/notification/get_notification")).data;
  }
  async markAsRead() {
    return (await this.http.get("/api/notification/markAsRead")).data;
  }
  async deleteNotification(data) {
    return (await this.http.post(`/api/notification/deleteNotification`, data))
      .data;
  }
  async createNotification(data) {
    return (await this.http.post(`/api/notification/createNotification`, data))
      .data;
  }
  async deleteNotificationById() {
    return (await this.http.get("/api/notification/deleteAllNotificationById"))
      .data;
  }

  //session
  async sessionData() {
    return (await this.http.get("/api/session")).data;
  }
  async verifyToken(token) {
    return (await this.http.get(`/api/tokenVerify?token=${token}`)).data;
  }
  async auth0Verification (data){
    return (await this.http.post("/api/auth_verify",data)).data
  }

  //dashboard
  async liveRoom() {
    return (await this.http.get("/api/dashboard/liveroom")).data;
  }
  async roomCount(data) {
    return (await this.http.post("/api/dashboard/rooms_count", data)).data;
  }
  async roomUpdates() {
    return (await this.http.get("/api/dashboard/room_updates")).data;
  }
  async roomVisitors(data) {
    return (await this.http.post("/api/dashboard/room_status", data)).data;
  }
  async scheduleCount(publicView) {
    return (
      await this.http.get(
        `/api/dashboard/scheduleMeetingOrder?publicView=${publicView}`
      )
    ).data;
  }
  async subscriptionCount() {
    return (await this.http.get("/api/dashboard/subscription_count")).data;
  }
  async invitesSent() {
    return (await this.http.get("/api/dashboard/invitesSent")).data;
  }
  async get_feedback() {
    return (await this.http.get("/api/dashboard/get_feedback")).data;
  }
  async delete_feedback(id) {
    return (await this.http.delete(`/api/dashboard/delete_feedback/${id}`))
      .data;
  }
  async all_transaction() {
    return (await this.http.get("/api/dashboard/get_all_transaction")).data;
  }
  async delete_transaction(id) {
    return (await this.http.delete(`/api/dashboard/delete_transaction/${id}`))
      .data;
  }
  async all_users() {
    return (await this.http.get("/api/dashboard/allusers")).data;
  }
  async roomShared() {
    return (await this.http.get("/api/dashboard/roomShared")).data;
  }
  async sendMail(data) {
     return (await this.http.post("/api/dashboard/send_mails",data)).data;
  }

  //pricing
  async pricing() {
    return (await this.http.get("/api/pricing")).data;
  }
  async updatePlan(data) {
    return (await this.http.post("/api/pricing/update", data)).data;
  }
  async createNewPlan(data) {
    return (await this.http.post("/api/pricing/create_plan", data)).data;
  }
  async deletePlan(id) {
    return (await this.http.delete(`/api/pricing/delete_plan/${id}`)).data;
  }
  async getAddonPlan() {
    return (await this.http.get("/api/pricing/get_addon_plan")).data;
  }
  async updateAddonPlan(data) {
    return (await this.http.post("/api/pricing/update_addon_plan", data)).data;
  }

  //checkout
  async checkout(data) {
    return (await this.http.post("/api/checkout", data)).data;
  }
  async createAccount(data) {
    return (await this.http.post("/api/checkout/createaccount", data)).data;
  }
  async addTransaction(data) {
    return (await this.http.post("/api/checkout/addTransaction", data)).data;
  }
  async paymentSuccess(data) {
    return (await this.http.post("/api/checkout/payment-success", data)).data;
  }
  async cancelTransaction(data) {
    return (await this.http.post("/api/checkout/cancelTransaction", data)).data;
  }
  async failedTransaction(data) {
    return (await this.http.post("/api/checkout/failed_transaction", data))
      .data;
  }
  async addonpaymentVerification(data) {
    return (
      await this.http.post("/api/checkOut/addonPaymentVerification", data)
    ).data;
  }

  //analytics_dashboard
  async getAllAnalyticsByMeetingId(id, page, perPage) {
    return (
      await this.http.get(
        `/api/analytics_dashboard/get_all/${id}?page=${page}&perPage=${perPage}`
      )
    ).data;
  }

  async getTotalduration() {
    return (await this.http.get("/api/analytics_dashboard/total_duration"))
      .data;
  }

  //AI Assistant

  async createChatSession(data) {
    return (await this.http.post("/api/ai_assistant/createChatSession", data))
      .data;
  }
  async getChatSession(userId, assistantCode) {
    return (
      await this.http.get(
        `/api/ai_assistant/getChatSession/${userId}/${assistantCode}`
      )
    ).data;
  }
  async getMessages(sessionId) {
    return (await this.http.get(`/api/ai_assistant/getMessages/${sessionId}`))
      .data;
  }
  async createMessage(data) {
    return (await this.http.post("/api/ai_assistant/createMessage", data)).data;
  }
  async renameChatSession(sessionId, data) {
    return (
      await this.http.patch(
        `/api/ai_assistant/renameSession/${sessionId}`,
        data
      )
    ).data;
  }
  async deleteChatSession(sessionId) {
    return (
      await this.http.delete(`/api/ai_assistant/deleteChatSession/${sessionId}`)
    ).data;
  }

  //Auth0 
  async getAllAuth0users(params){
    return (await this.http.get(`/api/auth0/users?${params}`)).data;
  }

  async updateAuth0User(userId,data){
    return (await this.http.patch(`/api/auth0/users/${userId}`,data)).data;
  }

   async deleteAuth0User(userId){
    return (await this.http.delete(`/api/auth0/users/${userId}`)).data;
  }
}
// const token = localStorage.getItem('access_token');
function isValidJson(json) {
  try {
    const js = JSON.parse(json);
    return js;
  } catch (e) {
    const js = JSON.stringify(json);
    const parsejs = JSON.parse(js);
    return parsejs;
  }
}
const apiClients = new ApiClient(config.baseApiUrl);

export default apiClients;
