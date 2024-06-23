import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMarker, FaDatabase, FaLevelDownAlt, FaMailBulk } from "react-icons/fa";
import { FaCheck, FaUsersViewfinder } from "react-icons/fa6";
import './App.css';

function NavBar() {
  return (
    <nav className="nav">
      <div className="company-name">MAIL.ME <FaMarker /></div>
    </nav>
  );
}

const DataSection = ({ data, handleDataChange }) => (
  <div className="section data-section">
    <div className="section-title">DATA <FaDatabase /></div>
    <input
      type="text"
      name="name"
      placeholder="Name"
      value={data.name}
      onChange={handleDataChange}
    />
    <input
      type="text"
      name="id"
      placeholder="ID"
      value={data.id}
      onChange={handleDataChange}
    />
    <input
      type="text"
      name="category"
      placeholder="Category"
      value={data.category}
      onChange={handleDataChange}
    />
  </div>
);

const InputSection = ({ inputText, handleInputChange, customHeader, customFooter, handleCustomChange }) => (
  <div className="section input-section">
    <div className="section-title">INPUT <FaLevelDownAlt /></div>
    <h4>ADD CUSTOM HEADER</h4>
    <div className="custom-inputs">
      <input
        type="text"
        name="customHeader"
        placeholder="USE {name} to add name and {order id} to add order id"
        value={customHeader}
        onChange={handleCustomChange}
      />
    </div>
    <h4>ADD CONTENT</h4>
    <textarea
      className="input-textarea"
      placeholder="Enter your text here"
      value={inputText}
      onChange={handleInputChange}
    />
    
    <h4>ADD CUSTOM FOOTER</h4>
    <input
      type="text"
      name="customFooter"
      placeholder="Custom Footer"
      value={customFooter}
      onChange={handleCustomChange}
    />
  </div>
);

const PreviewSection = ({ preview }) => (
  <div className="section preview-section">
    <div className="section-title">PREVIEW <FaUsersViewfinder /></div>
    <div className="preview-box">
      <p><strong>Name:</strong> {preview.name}</p>
      <p><strong>ID:</strong> {preview.id}</p>
      <p><strong>Category:</strong> {preview.category}</p>
      <div className="preview-text">
        <p>{preview.text.split('\n').map((line, index) => (
          <span key={index}>{line}<br /></span>
        ))}</p>
      </div>
      <p><strong>To:</strong> {preview.to}</p>
      <p><strong>CC:</strong> {preview.cc}</p>
    </div>
  </div>
);

const EmailSection = ({ email, handleEmailChange, handleSendClick }) => (
  <div className="section email-section">
    <div className="section-title">EMAIL <FaMailBulk /></div>
    <input
      type="text"
      name="to"
      placeholder="To"
      value={email.to}
      onChange={handleEmailChange}
    />
    <input
      type="text"
      name="cc"
      placeholder="CC"
      value={email.cc}
      onChange={handleEmailChange}
    />
    <button className="send-button" onClick={handleSendClick}>SEND <FaCheck /></button>
  </div>
);
const TemplateSection = ({ handleTemplateClick }) => (
  <div className="section template-section">
    <div className="section-title">TEMPLATE</div>
    <div className="template-boxes">
      <div className="template-box" onClick={() => handleTemplateClick('NEWS')}>
        NEWS <br />
      </div>
      <div className="template-box" onClick={() => handleTemplateClick('OFFER')}>
        OFFER <br />
      </div>
      <div className="template-box" onClick={() => handleTemplateClick('INVITATION')}>
        INVITATION <br />
      </div>
      <div className="template-box" onClick={() => handleTemplateClick('WELCOME')}>
        WELCOME <br />
      </div>
      <div className="template-box" onClick={() => handleTemplateClick('PROMOTIONAL')}>
        PROMOTIONAL <br />
      </div>
    </div>
  </div>
);
const copyToClipboard = (content) => {
  navigator.clipboard.writeText(content)
    .then(() => alert("Content copied to clipboard"))
    .catch((error) => console.error("Failed to copy:", error));
};

function App() {
  const [data, setData] = useState({ name: '', id: '', category: '' });
  const [inputText, setInputText] = useState('');
  const [email, setEmail] = useState({ to: '', cc: '' });
  const [preview, setPreview] = useState({ name: '', id: '', category: '', text: '', to: '', cc: '' });
  const [customHeader, setCustomHeader] = useState('');
  const [customFooter, setCustomFooter] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState('');

  const handleDataChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleEmailChange = (event) => {
    const { name, value } = event.target;
    setEmail({ ...email, [name]: value });
  };

  const handleCustomChange = (event) => {
    const { name, value } = event.target;
    if (name === 'customHeader') {
      setCustomHeader(value);
    } else if (name === 'customFooter') {
      setCustomFooter(value);
    }
  };

  const handleChatInputChange = (event) => {
    setChatInput(event.target.value);
  };

  const handleChatClick = () => {
    setChatHistory(chatHistory + `You: ${chatInput}\n`);
    setChatInput('');
  };

  useEffect(() => {
    const replacePlaceholders = (text, name, id) => {
      return text.replace('{name}', name).replace('{order id}', id);
    };

    const headerText = replacePlaceholders(customHeader || `Welcome {name}.\n Your order id {order id}.`, data.name, data.id);
    const footerText = replacePlaceholders(customFooter || 'Thanks for your attention.', data.name, data.id);
    const formattedText = `${headerText}\n\n${inputText}\n\n${footerText}`;
    setPreview({ ...data, text: formattedText, to: email.to, cc: email.cc });
  }, [data, inputText, email, customHeader, customFooter]);

  const handleSendClick = () => {
    const emailData = {
      to: preview.to,
      cc: preview.cc,
      subject: 'New Message from MAIL.ME',
      text: preview.text
    };

    axios.post('http://localhost:3001/send-email', emailData)
      .then(response => {
        alert('Email sent successfully!');
      })
      .catch(error => {
        console.error('Failed to send email:', error);
        alert('Failed to send email: ' + error.message);
      });

    const excelData = {
      name: data.name,
      id: data.id,
      category: data.category,
      text: preview.text,
      to: email.to
    };

    axios.post('http://localhost:3001/save-data', excelData)
      .then(response => {
        alert('Data saved to MongoDB successfully!');
      })
      .catch(error => {
        console.error('Failed to save data:', error);
        alert('Failed to save data: ' + error.message);
      });
  };

  const handleButtonClick = () => {
    // Replace 'https://example.com' with the actual URL you want to open
    window.open('http://localhost:5173/', '_blank');
  };
  const handleTemplateClick = (template) => {
    let header = '';
    let content = '';
    let footer = '';

    switch (template) {
      case 'NEWS':
        header = 'Latest News for {name}';
        content = 'Here are the latest updates and news...';
        footer = 'Stay tuned for more news.';
        break;
      case 'OFFER':
        header = 'Special Offer for {name}';
        content = 'We are excited to offer you...';
        footer = 'Don’t miss out on this special offer!';
        break;
      case 'INVITATION':
        header = 'You’re Invited, {name}';
        content = 'We are pleased to invite you to...';
        footer = 'We look forward to seeing you!';
        break;
      case 'WELCOME':
        header = 'Welcome {name}!';
        content = 'We are thrilled to welcome you...';
        footer = 'Thanks for joining us!';
        break;
      case 'PROMOTIONAL':
        header = 'Exclusive Promotion for {name}';
        content = 'Check out our latest promotion...';
        footer = 'Enjoy your shopping!';
        break;
      default:
        break;
    }

    setCustomHeader(header);
    setInputText(content);
    setCustomFooter(footer);
  };

  return (
    <div className="App">
      <NavBar />
      <div className="content">
        <div className="upper">
          <DataSection data={data} handleDataChange={handleDataChange} />
          <InputSection
            inputText={inputText}
            handleInputChange={handleInputChange}
            customHeader={customHeader}
            customFooter={customFooter}
            handleCustomChange={handleCustomChange}
          />
          <PreviewSection preview={preview} />
          <EmailSection email={email} handleEmailChange={handleEmailChange} handleSendClick={handleSendClick} />
        </div>
        <div className="lower">
          <button className="single-button" onClick={handleButtonClick}>CHAT UP!</button>
        </div>
        <TemplateSection handleTemplateClick={handleTemplateClick} />
      </div>
    </div>
  );
}

export default App;
