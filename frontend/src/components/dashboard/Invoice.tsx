import React from 'react';
import styles from './Invoice.module.css';

interface InvoiceProps {
    bill: {
        id: number;
        billDate: Date;
        totalAmount: number;
        discountAmount: number;
        taxAmount: number;
        advanceAmount: number;
        balanceAmount: number;
        status: string;
    };
    customer: {
        name: string;
        email: string;
        address?: string;
    };
    car: {
        make: string;
        model: string;
        regNumber: string;
    };
}

const Invoice: React.FC<InvoiceProps> = ({ bill, customer, car }) => {
    return (
        <div className={styles.invoiceContainer}>
            <div className={styles.header}>
                <div>
                    <h1>INVOICE</h1>
                    <p>Bill ID: #{bill.id}</p>
                    <p>Date: {new Date(bill.billDate).toLocaleDateString()}</p>
                </div>
                <div className={styles.companyInfo}>
                    <h2>CarDealer Pro</h2>
                    <p>123 Luxury Lane, Automotive City</p>
                    <p>contact@cardealer.com</p>
                </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.billingInfo}>
                <div className={styles.billTo}>
                    <h3>Bill To:</h3>
                    <p><strong>{customer.name}</strong></p>
                    <p>{customer.email}</p>
                    <p>{customer.address || 'N/A'}</p>
                </div>
                <div className={styles.vehicleInfo}>
                    <h3>Vehicle Details:</h3>
                    <p><strong>{car.make} {car.model}</strong></p>
                    <p>Reg: {car.regNumber}</p>
                </div>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th className={styles.textRight}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Base Rental / Purchase Amount</td>
                        <td className={styles.textRight}>${Number(bill.totalAmount).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td>Discount</td>
                        <td className={styles.textRight}>-${Number(bill.discountAmount).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td>Tax (15%)</td>
                        <td className={styles.textRight}>${Number(bill.taxAmount).toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>

            <div className={styles.summary}>
                <div className={styles.summaryRow}>
                    <span>Subtotal:</span>
                    <span>${(Number(bill.totalAmount) - Number(bill.discountAmount) + Number(bill.taxAmount)).toLocaleString()}</span>
                </div>
                <div className={styles.summaryRow}>
                    <span>Advance Paid:</span>
                    <span>${Number(bill.advanceAmount).toLocaleString()}</span>
                </div>
                <div className={styles.totalRow}>
                    <span>Balance Due:</span>
                    <span>${Number(bill.balanceAmount).toLocaleString()}</span>
                </div>
            </div>

            <div className={styles.footer}>
                <p>Status: <span className={styles[bill.status.toLowerCase()]}>{bill.status}</span></p>
                <p>Thank you for choosing CarDealer Pro!</p>
            </div>
        </div>
    );
};

export default Invoice;
