import localStore, { InitState, Message, isJSONString } from "@/store";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export interface IProps {
  keySubscriber: keyof InitState;
  currentKey: keyof InitState;
}

const MessageViewModel = (props: IProps) => {
  const { keySubscriber, currentKey } = props;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState("");
  const onSendMessage = () => {
    if (message?.trim()?.length) {
      const currentMessages = localStore.getValue<Message[]>(currentKey);
      if (Array.isArray(currentMessages)) {
        localStore.addKeyValue<Message[]>(currentKey, [
          ...currentMessages,
          { id: uuidv4(), message },
        ]);
      } else if (currentMessages) {
        localStore.addKeyValue<Message[]>(currentKey, [
          {
            id: uuidv4(),
            message:
              typeof currentMessages === "string"
                ? currentMessages
                : JSON.stringify(currentMessages),
          },
          {
            id: uuidv4(),
            message,
          },
        ]);
      } else {
        localStore.addKeyValue<Message[]>(currentKey, [
          {
            id: uuidv4(),
            message,
          },
        ]);
      }
    }
    setMessage("");
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event?.target?.value);
  };
  const onSubscribeUpdateData = (data: string) => {
    setMessages(data);
  };
  const listMessages = useMemo(() => {
    if (isJSONString(messages)) {
      return JSON.parse(messages);
    }
    return [];
  }, [messages]);
  const handleRenderContent = () => {
    if (Array.isArray(listMessages)) {
      return listMessages?.map((item) => (
        <div key={item?.id ?? uuidv4()}>
          {item?.message ?? JSON.stringify(item)}
        </div>
      ));
    }
    if (
      typeof listMessages !== "function" &&
      typeof listMessages !== "object" &&
      typeof listMessages !== "symbol"
    ) {
      return <div>{listMessages}</div>;
    }
    return <div>{JSON.stringify(listMessages)}</div>;
  };
  useEffect(() => {
    localStore.subscribe(keySubscriber, onSubscribeUpdateData);
    return () => {
      localStore.removeSubscribe();
    };
  }, [keySubscriber]);
  return {
    handleRenderContent,
    onSendMessage,
    onChange,
    message,
  };
};

export default MessageViewModel;
