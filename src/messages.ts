import { AppModuleMessages } from "./_boot/appModules";
import { makeMessegeBundle } from "./_lib/message/MessageBundle";

type Messages = AppModuleMessages;

const messageBundle = makeMessegeBundle<Messages>();

const { getMessage, updateBundle, useBundle } = messageBundle;

type MessageBundle = typeof messageBundle;

export { messageBundle, getMessage, updateBundle, useBundle };
export type { Messages, MessageBundle };
