const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        // eslint-disable-next-line no-useless-escape
        return /https?:\/\/(www\.)?[a-z0-9-\.\_\-~:\/?#[\]@!$&'\(\)\*\+,;=]+#?/.test(v);
      },
      message: (props) => `${props.value} неправильный формат ссылки`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }],
    default: [],
  },

}, {
  versionKey: false,
});

// создаём модель и экспортируем её
module.exports = mongoose.model('card', cardSchema);
