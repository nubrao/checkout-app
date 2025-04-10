'use client';

import React from 'react';
import { Modal, Typography } from 'antd';
import styles from './TermsModal.module.css';

const { Title, Paragraph } = Typography;

const TermsModal = ({ open, onClose }) => {
    return (
        <Modal
            title={<Title level={2}>Terms & Conditions</Title>}
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
            className={styles.termsModal}
        >
            <div className={styles.termsContent}>
                <Paragraph>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </Paragraph>

                <Title level={3}>1. Acceptance of Terms</Title>
                <Paragraph>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </Paragraph>

                <Title level={3}>2. User Responsibilities</Title>
                <Paragraph>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </Paragraph>

                <Title level={3}>3. Privacy Policy</Title>
                <Paragraph>
                    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                </Paragraph>

                <Title level={3}>4. Payment Terms</Title>
                <Paragraph>
                    Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
                </Paragraph>

                <Title level={3}>5. Delivery Policy</Title>
                <Paragraph>
                    Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.
                </Paragraph>
            </div>
        </Modal>
    );
};

export default TermsModal;