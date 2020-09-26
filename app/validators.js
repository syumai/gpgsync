const maxRoomIdLength = 20;
const maxSharedContentIdLength = 20;

const validateRoomId = (roomId) => {
  if (roomId.length > maxRoomIdLength) {
    throw new InvalidArgumentError(
      "Room ID is too long (must be <= " + maxRoomIdLength + ")"
    );
  }
};

const validateSharedContentIdLength = (sharedContentId) => {
  if (sharedContentId.length > maxSharedContentIdLength) {
    throw new InvalidArgumentError(
      "Shared Content ID is too long (must be <= " +
        maxSharedContentIdLength +
        ")"
    );
  }
};

module.exports = {
  validateRoomId,
  validateSharedContentIdLength,
};
