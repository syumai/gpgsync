import { InvalidArgumentError } from "./errors.ts";

const maxRoomIdLength = 20;
const maxSharedContentIdLength = 20;

const validateRoomId = (roomId: string): void => {
  if (roomId.length > maxRoomIdLength) {
    throw new InvalidArgumentError(
      "Room ID is too long (must be <= " + maxRoomIdLength + ")"
    );
  }
};

const validateSharedContentIdLength = (sharedContentId: string): void => {
  if (sharedContentId.length > maxSharedContentIdLength) {
    throw new InvalidArgumentError(
      "Shared Content ID is too long (must be <= " +
        maxSharedContentIdLength +
        ")"
    );
  }
};

export {
  validateRoomId,
  validateSharedContentIdLength,
};
