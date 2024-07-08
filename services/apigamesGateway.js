const API = require("./moduleAxiosFunc");
exports.checkUserIdGames = async (dto) => {
  try {
    const querys = `${dto.game_id}?user_id=${dto.user_id} ${dto.server_id}`
    const response = await API.getApiGames(`/cek-username/${querys}`);
    return response;
  } catch (error) {
    throw { message: error.error_msg };
  }
};