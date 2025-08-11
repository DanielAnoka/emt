import React, { useState } from 'react';
import { Estate } from '../../types';
import { X, Key, Copy, Eye, EyeOff, CheckCircle } from 'lucide-react';

interface GenerateEstateLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  estate: Estate;
}

export const GenerateEstateLoginModal: React.FC<GenerateEstateLoginModalProps> = ({ 
  isOpen, 
  onClose, 
  estate 
}) => {
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const copyCredentials = () => {
    const adminEmail = `admin@${estate.name.toLowerCase().replace(/\s+/g, '')}.com`;
    const credentials = `Estate Admin Login Credentials for ${estate.name}
Email: ${adminEmail}
Password: ${generatedPassword}
Role: Estate Admin
Estate: ${estate.name}
Estate ID: ${estate.id}`;
    
    copyToClipboard(credentials);
  };

  if (!isOpen) return null;

  const adminEmail = `admin@${estate.name.toLowerCase().replace(/\s+/g, '')}.com`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Generate Estate Admin Login</h2>
            <p className="text-sm text-gray-600 mt-1">For {estate.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Estate Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Estate Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Estate Name:</span>
                <span className="font-medium">{estate.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Address:</span>
                <span className="font-medium text-right">{estate.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Units:</span>
                <span className="font-medium">{estate.totalUnits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estate ID:</span>
                <span className="font-medium">{estate.id}</span>
              </div>
            </div>
          </div>

          {/* Admin Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Email (Auto-generated)
            </label>
            <div className="relative">
              <input
                type="text"
                value={adminEmail}
                readOnly
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <button
                onClick={() => copyToClipboard(adminEmail)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Password Generation */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Admin Password</h3>
              <button
                onClick={generatePassword}
                className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-150 flex items-center"
              >
                <Key className="w-4 h-4 mr-1" />
                Generate
              </button>
            </div>
            
            {generatedPassword && (
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={generatedPassword}
                  readOnly
                  className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(generatedPassword)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Login Credentials Summary */}
          {generatedPassword && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-3">Estate Admin Credentials</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Email:</span>
                  <span className="font-medium text-blue-900">{adminEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Password:</span>
                  <span className="font-mono text-blue-900">{showPassword ? generatedPassword : '••••••••'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Role:</span>
                  <span className="font-medium text-blue-900">Estate Admin</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-150"
            >
              Close
            </button>
            {generatedPassword && (
              <button
                onClick={copyCredentials}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-150 flex items-center justify-center"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All
                  </>
                )}
              </button>
            )}
          </div>

          {/* Instructions */}
          {generatedPassword && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Important Instructions</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Share these credentials securely with the estate admin</li>
                <li>• Admin should change password after first login</li>
                <li>• Keep a secure record of generated credentials</li>
                <li>• Admin will have full access to manage this estate</li>
                <li>• Credentials are case-sensitive</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};