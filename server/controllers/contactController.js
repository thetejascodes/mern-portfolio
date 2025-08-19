const mongoose = require('mongoose');
const express = require('express');
const nodemailer = require('nodemailer');
const Contact = require('../models/contactModel');

exports.createContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const newMessage = new Contact({ name, email, message });
        await newMessage.save();
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS

            }

        })
        const mailOptions = {
            from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
            to: process.env.RECEIVER_EMAIL, 
            subject: 'New Portfolio Message',
            html: `
                <h3>You have a new message from your portfolio</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        };
        await transporter.sendMail(mailOptions);
        res.status(201).json({ success: true, message: 'Message sent successfully'})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}