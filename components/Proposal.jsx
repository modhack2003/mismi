"use client";
import { useState } from "react";
import emailjs from "@emailjs/browser";
const defaultImage = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=400";

const Proposal = ({ config, onYes }) => {
  const [noPosition, setNoPosition] = useState({ top: "60%", left: "60%" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [noCount, setNoCount] = useState(0);
  const [showFriendMessage, setShowFriendMessage] = useState(false);

  const proposalConfig = config?.proposal || {};
  const image = proposalConfig.image || defaultImage;
  const question = proposalConfig.question || "Will you be mine, Kaberi? 💖";
  const yesButton = proposalConfig.yesButton || "Yes 💘";
  const noButton = proposalConfig.noButton || "No 😭";
  const friendMessageTitle = proposalConfig.friendMessageTitle || "If you need time, I will wait for you, <br /> but don't reject my proposal 💔";
  const friendMessageBody = proposalConfig.friendMessageBody || "We can be best friends... 😊";
  const emailjsConfig = proposalConfig.emailjs || {
    serviceID: "service_sqqt593",
    templateID: "template_gzxcb4f",
    publicKey: "KmSHcuv2A_ZOa08bz",
    toName: "Biku",
    fromName: "Your Mismi",
    successMessage: "She said YES! 💖",
    friendMessage: `She didn't say yes, but I told her: "If you need time, I will wait for you, but don't reject my proposal. We can be best friends..."`
  };

  const moveNoButton = () => {
    if (noCount >= 7) return;

    const randTop = Math.floor(Math.random() * 70 + 10);
    const randLeft = Math.floor(Math.random() * 70 + 10);
    setNoPosition({ top: `${randTop}%`, left: `${randLeft}%` });

    const newCount = noCount + 1;
    setNoCount(newCount);

    if (newCount >= 7) {
      sendFriendMessageEmail();
      setShowFriendMessage(true);
    }
  };

  const sendFriendMessageEmail = () => {
    const { serviceID, templateID, publicKey, toName, fromName, friendMessage, toEmail, certificateUrl } = emailjsConfig;

    const templateParams = {
      to_name: toName,
      from_name: fromName,
      message: friendMessage,
      to_email: toEmail,
      certificate_url: certificateUrl,
    };

    emailjs.send(serviceID, templateID, templateParams, publicKey).catch((err) => {
      console.error("EmailJS error:", err);
    });
  };

  const handleYesClick = () => {
    setSending(true);
    setError(null);

    const { serviceID, templateID, publicKey, toName, fromName, successMessage, toEmail, certificateUrl } = emailjsConfig;

    const templateParams = {
      to_name: toName,
      from_name: fromName,
      message: successMessage,
      to_email: toEmail,
      certificate_url: certificateUrl,
    };

    emailjs
      .send(serviceID, templateID, templateParams, publicKey)
      .then(() => {
        setSending(false);
        onYes();
      })
      .catch((err) => {
        setSending(false);
        setError("Failed to send email. Please try again.");
        console.error("EmailJS error:", err);
      });
  };

  if (showFriendMessage) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-6 text-center bg-pink-50 font-love">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: friendMessageTitle }}>
        </h2>
        <p className="text-xl text-gray-600">
          {friendMessageBody}
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-screen flex flex-col items-center justify-center font-love">
      <h2 className="text-4xl sm:text-5xl font-bold text-rose-700 mb-6">
        {question}
      </h2>

      <img
        src={image}
        alt="Proposal Image"
        className="w-64 h-64 rounded-full object-cover border-4 border-rose-300 shadow-lg mb-8"
      />

      <div className="flex gap-6 w-full h-40 justify-center font-sans relative">
        <button
          onClick={handleYesClick}
          disabled={sending}
          className="bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700 transition-all shadow-md h-1/3"
        >
          {sending ? "Sending..." : yesButton}
        </button>

        {noCount < 7 && (
          <button
            onMouseEnter={moveNoButton}
            onTouchStart={moveNoButton}
            style={{
              position: "absolute",
              top: noPosition.top,
              left: noPosition.left,
            }}
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-full transition-all cursor-pointer shadow"
          >
            {noButton}
          </button>
        )}
      </div>

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default Proposal;
