import { ArrowDownwardOutlined, ArrowUpwardOutlined, ChatBubbleOutlineOutlined, MoreHorizOutlined, RepeatOutlined,ShareOutlined } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import "../Css/Post.css";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import db from "../firebase";
import { collection, onSnapshot, orderBy, query, doc, data, addDoc, serverTimestamp } from "firebase/firestore";
import { selectUser } from "../features/userSlice";
import { selectQuestionId, setQuestionInfo } from "../features/questionSlice";

Modal.setAppElement("#root");

function Post({ Id, question, image, timestamp, quoraUser }) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const [IsmodalOpen, setIsModalOpen] = useState(false);
  const questionId = useSelector(selectQuestionId);
  const [answer, setAnswer] = useState("");
  const [getAnswers, setGetAnswers] = useState([]);

  useEffect(() => {
    if (questionId) {
      const q = query(
        collection(db, "questions", questionId, "answer"),
        orderBy("timestamp", "desc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) =>
        setGetAnswers(
          snapshot.docs.map((doc) => ({ id: doc.id, answers: doc.data() }))
        )
      );

      return () => {
        unsubscribe();
      };
    }
  }, [questionId]);

  const handleAnswer = async (e) => {
    e.preventDefault();

    if (questionId) {
      try {
        const docRef = await addDoc(
          collection(db, "questions", questionId, "answer"),
          {
            user: user,
            answer: answer,
            questionId: questionId,
            timestamp: serverTimestamp(),
          }
        );
        console.log("Answer written with ID: ", docRef.id);
      } catch (error) {
        console.error("Error adding answer: ", error);
      }
    }
    setAnswer("");
    setIsModalOpen(false);
  };

  return (
    <div
      className="post"
      onClick={() =>
        dispatch(
          setQuestionInfo({
            questionId: Id,
            questionName: question,
          })
        )
      }
    >
      <div className="post__info">
        <Avatar
          src={
            quoraUser.photo
              ? quoraUser.photo
              : "data:image/png;base64,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"
          }
          imgProps={{ referrerPolicy: "no-referrer" }}
        />
        <h5>
          {quoraUser.displayName ? quoraUser.displayName : quoraUser.email}
        </h5>
        <small>{new Date(timestamp?.toDate()).toLocaleString()}</small>
      </div>
      <div className="post__body">
        <div className="post__question">
          <p>{question}</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="post__btnAnswer"
          >
            Answer
          </button>
          <Modal
            isOpen={IsmodalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            shouldCloseOnOverlayClick={false}
            style={{
              overlay: {
                width: 700,
                height: 600,
                backgroundColor: "rgba(0,0,0,0.8)",
                zIndex: "1000",
                top: "50%",
                left: "50%",
                marginTop: "-300px",
                marginLeft: "-350px",
              },
            }}
          >
            <div className="modal__question">
              <h1>{question}</h1>
              <p>
                asked by{" "}
                <span className="name">
                  {quoraUser.displayName
                    ? quoraUser.displayName
                    : quoraUser.email}
                </span>{" "}
                {""}
                on{" "}
                <span className="name">
                  {new Date(timestamp?.toDate()).toLocaleString()}
                </span>
              </p>
            </div>
            <div className="modal__answer">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter Your Answer"
                type="text"
              />
            </div>
            <div className="modal__button">
              <button className="cancle" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button type="sumbit" onClick={handleAnswer} className="add">
                Add Answer
              </button>
            </div>
          </Modal>
        </div>
        <div className="post__answer">
          {getAnswers.map(({ id, answers }) => (
            <p key={id} style={{ position: "relative", paddingBottom: "5px" }}>
              {Id === answers.questionId ? (
                <span>
                  {answers.answer}
                  <br />
                  <span
                    style={{
                      position: "absolute",
                      color: "gray",
                      fontSize: "small",
                      display: "flex",
                      right: "0px",
                    }}
                  >
                    <span style={{ color: "#b92b27" }}>
                      {answers.user.displayName
                        ? answers.user.displayName
                        : answers.user.email}{" "}
                      on{" "}
                      {new Date(answers.timestamp?.toDate()).toLocaleString()}
                    </span>
                  </span>
                </span>
              ) : (
                ""
              )}
            </p>
          ))}
        </div>
        <img src={image} alt="" />
      </div>
      <div className="post__footer">
        <div className="post__footerAction">
          <ArrowUpwardOutlined />
          <ArrowDownwardOutlined />
        </div>
        <RepeatOutlined />
        <ChatBubbleOutlineOutlined />
        <div className="post__footerLeft">
          <ShareOutlined />
          <MoreHorizOutlined />
        </div>
      </div>
    </div>
  );
}

export default Post;
