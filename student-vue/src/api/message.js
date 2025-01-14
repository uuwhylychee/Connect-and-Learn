import request from "@/utils/request";

// messages/send
export const messagesSend = (data) =>
  request({
    url: "messages/send",
    method: "post",
    data,
  });

// messages/reply
export const messagesReply = (data) =>
  request({
    url: "messages/reply",
    method: "post",
    data,
  });

// conversations/:conversations
export const messagesUsers = (id, data={}) => {
  return request({
    url: `conversations/${id}`,
    method: "get",
    data,
  });
}

// messages/all
export const messagesAll = (data = {}) => {
  return request({
    url: "messages/all",
    method: "get",
    data,
  });
}
