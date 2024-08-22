import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <h1>Privacy Policy</h1>
      
      <ul>
        <li>
          <strong>Introduction:</strong>
          <ul>
            <li>Welcome to Impact Resume. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website [website URL], including any other media form, media channel, mobile website, or mobile application related or connected thereto (collectively, the “Site”).</li>
            <li>We use Firebase as our backend database and Google Provider for account management.</li>
            <li>By using our service, you agree to the terms outlined in this Privacy Policy.</li>
          </ul>
        </li>

        <li>
          <strong>Data Collection:</strong>
          <ul>
            <li>We collect several types of information for various purposes to provide and improve our Service to you.</li>

            <li>
              <strong>Types of Data Collected:</strong>
              <ul>
                <li>
                  <strong>Personal Information:</strong>
                  <ul>
                    <li>Google Account Information: Display Name, Photo URL, Email Address</li>
                    <li>Created Resumes, which may include but are not limited to:
                      <ul>
                        <li>Full Name</li>
                        <li>Address</li>
                        <li>Phone Number</li>
                        <li>Email Address</li>
                        <li>LinkedIn URL</li>
                        <li>Educational Background</li>
                        <li>Work Experience</li>
                        <li>Skills and Competencies</li>
                        <li>Awards and Certifications</li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Usage Data:</strong>
                  <ul>
                    <li>Browser type</li>
                    <li>IP address</li>
                    <li>Device Information (e.g., device type, operating system)</li>
                  </ul>
                </li>
              </ul>
            </li>

            <li>
              <strong>Methods of Data Collection:</strong>
              <ul>
                <li>Data provided by users during registration and profile updates through Google Provider</li>
                <li>Data automatically collected through the use of the service</li>
              </ul>
            </li>
          </ul>
        </li>

        <li>
          <strong>Data Usage:</strong>
          <ul>
            <li>To provide and maintain the service</li>
            <li>To manage user accounts through Google Provider</li>
            <li>To personalize user experience</li>
            <li>To communicate with users</li>
            <li>To improve the service</li>
            <li>For security and fraud prevention</li>
          </ul>
        </li>

        <li>
          <strong>Data Protection and Security:</strong>
          <ul>
            <li>We use administrative, technical, and physical security measures to help protect your personal information.</li>
            <li>
              <strong>Firebase Security Measures:</strong>
              <ul>
                <li>Firebase complies with industry standards for security.</li>
              </ul>
            </li>
            <li>
              <strong>Firebase Security Rules:</strong>
              <ul>
                <li>Only logged-in users can access and modify their own data.</li>
              </ul>
            </li>
            <li>
              <strong>Encryption Protocols:</strong>
              <ul>
                <li>Data is encrypted at rest and during transmission.</li>
                <li>Regular security audits are conducted.</li>
              </ul>
            </li>
          </ul>
        </li>

        <li>
          <strong>Third-Party Services:</strong>
          <ul>
            <li>We use third-party services for various purposes, including Firebase as our backend service provider and Google Provider for account management.</li>
            <li>These third parties have access to your personal data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</li>

            <li>
              <strong>Google Provider:</strong>
              <ul>
                <li>Authentication and account management are handled through Google Provider</li>
                <li>We do not store passwords or other sensitive account information</li>
                <li>We retain Google account information such as Display Name, Photo URL, and Email Address</li>
              </ul>
            </li>

            <li>
              <strong>Stripe Payment Processing:</strong>
              <ul>
                <li>We use Stripe to process all payments.</li>
                <li>No payment information is stored on our servers.</li>
                <li>Stripe handles all payment processing and adheres to industry standards for security and compliance.</li>
              </ul>
            </li>
          </ul>
        </li>

        <li>
          <strong>User Rights:</strong>
          <ul>
            <li>While we strive to maintain accurate and up-to-date information, please note that certain limitations apply:</li>

            <li>
              <strong>Access and Correction:</strong>
              <ul>
                <li>You can access your personal information through your account settings and update it as necessary.</li>
                <li>Please note that we might not be able to correct all types of data inaccuracies.</li>
              </ul>
            </li>

            <li>
              <strong>Data Portability:</strong>
              <ul>
                <li>You may request an export of your data at any time.</li>
                <li>However, we are not responsible for the portability of data managed by third-party services such as Google or Stripe.</li>
              </ul>
            </li>

            <li>
              <strong>Data Deletion:</strong>
              <ul>
                <li>You can request deletion of your data by contacting us.</li>
                <li>We will delete your data within a reasonable timeframe unless required by law to retain it.</li>
                <li>Please note that some data might still remain accessible due to technical limitations or for compliance purposes.</li>
              </ul>
            </li>
          </ul>
        </li>

        <li>
          <strong>Cookies and Tracking Technologies:</strong>
          <ul>
            <li>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.</li>
            <li>Please note that we cannot control how third-party services use cookies and tracking technologies.</li>

            <li>
              <strong>Session Cookies:</strong>
              <ul>
                <li>We use session cookies to operate our service.</li>
              </ul>
            </li>

            <li>
              <strong>Persistent Cookies:</strong>
              <ul>
                <li>We use persistent cookies to remember your preferences and various settings.</li>
              </ul>
            </li>
          </ul>
        </li>

        <li>
          <strong>Children’s Privacy:</strong>
          <ul>
            <li>We do not knowingly collect information from children under 18.</li>
            <li>If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us.</li>
          </ul>
        </li>

        <li>
          <strong>Changes to this Privacy Policy:</strong>
          <ul>
            <li>We may update our Privacy Policy from time to time.</li>
            <li>We will notify you of any changes by posting the new Privacy Policy on this page and updating the “effective date” at the top of this Privacy Policy.</li>
          </ul>
        </li>

        <li>
          <strong>Contact Information:</strong>
          <ul>
            <li>If you have any questions about this Privacy Policy, please note that responses might be limited:</li>
            <li>Email: methan@umich.edu</li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default PrivacyPolicy;