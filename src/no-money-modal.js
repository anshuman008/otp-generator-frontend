import React from "react";
import { Modal } from "antd";
import NoMoneyImage from "./images/no-money.jpg";
import './buyNumber.scss'

const NoMoneyModal = ({ openModal, cancelModal }) => {
  return (
    <div>
      <Modal
        title="No Money Found!"
        open={openModal}
        onCancel={cancelModal}
        className="no-money-modal"
        footer={null}
      >
        <div className="image-div">
          <img src={NoMoneyImage} />
        </div>
        <div className="no-money-message">
          We're sorry, but there is not enough money in your account to complete
          this transaction. Please contact admin to get your account recharged.
        </div>
      </Modal>
    </div>
  );
};

export default NoMoneyModal;
