import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Form from './Form';

describe('ApplicationGenerator Form', () => {
    const defaultProps = {
        formData: {
            name: '',
            classSection: '',
            rollNumber: '',
            phoneNumber: '',
            recipientName: '',
            salutation: '',
            campusName: '',
            applicationType: '',
        },
        setFormData: jest.fn(),
        setShowForm: jest.fn(),
        formTitle: 'Test Application',
        handleAppGen: jest.fn(),
    };

    it('renders all required fields and disables submit until valid', async () => {
        render(<Form {...defaultProps} />);
        // All required fields should be in the document
        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Class Section/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Roll Number/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Recipient/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Select Campus/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Application Type/i)).toBeInTheDocument();

        // Submit button should be disabled
        const submitBtn = screen.getByRole('button', { name: /generate application/i });
        expect(submitBtn).toBeDisabled();

        // Try to submit and check for error messages
        fireEvent.click(submitBtn);
        expect(await screen.findAllByText(/required/i)).not.toHaveLength(0);
    });
}); 