import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { PhoneCall, Check, AlertCircle, Loader2 } from 'lucide-react';

const CALL_STATES = {
  IDLE: 'idle',
  CALLING: 'calling',
  IN_PROGRESS: 'in_progress',
  SUCCESS: 'success',
  FAILED: 'failed'
};

export function TestCall({ data, onBack, onFinish, isLoading = false }) {
  const [callState, setCallState] = useState(CALL_STATES.IDLE);
  const [callDuration, setCallDuration] = useState(0);

  const startTestCall = () => {
    setCallState(CALL_STATES.CALLING);

    // Mock: Simulate dialing
    setTimeout(() => {
      setCallState(CALL_STATES.IN_PROGRESS);

      // Simulate call duration
      let duration = 0;
      const interval = setInterval(() => {
        duration++;
        setCallDuration(duration);

        // End call after 5 seconds
        if (duration >= 5) {
          clearInterval(interval);
          setCallState(CALL_STATES.SUCCESS);
        }
      }, 1000);
    }, 2000);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
            <PhoneCall className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Test Your AI Assistant</h2>
            <p className="text-gray-400 text-sm mt-1">
              Make a test call to experience your AI in action
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* Call Simulator */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
          <div className="flex flex-col items-center">
            {/* Status Icon */}
            <div className={`
              w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all
              ${callState === CALL_STATES.IDLE && 'bg-gray-700'}
              ${callState === CALL_STATES.CALLING && 'bg-blue-600/20 animate-pulse'}
              ${callState === CALL_STATES.IN_PROGRESS && 'bg-green-600/20'}
              ${callState === CALL_STATES.SUCCESS && 'bg-green-600/20'}
              ${callState === CALL_STATES.FAILED && 'bg-red-600/20'}
            `}>
              {callState === CALL_STATES.IDLE && <PhoneCall className="w-12 h-12 text-gray-400" />}
              {callState === CALL_STATES.CALLING && <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />}
              {callState === CALL_STATES.IN_PROGRESS && <PhoneCall className="w-12 h-12 text-green-500" />}
              {callState === CALL_STATES.SUCCESS && <Check className="w-12 h-12 text-green-500" />}
              {callState === CALL_STATES.FAILED && <AlertCircle className="w-12 h-12 text-red-500" />}
            </div>

            {/* Status Text */}
            <div className="text-center mb-6">
              {callState === CALL_STATES.IDLE && (
                <div>
                  <div className="text-xl font-semibold text-white mb-2">Ready to Test</div>
                  <div className="text-gray-400 text-sm">
                    Click the button below to make a test call
                  </div>
                </div>
              )}
              {callState === CALL_STATES.CALLING && (
                <div>
                  <div className="text-xl font-semibold text-white mb-2">Calling...</div>
                  <div className="text-gray-400 text-sm">Connecting to your AI assistant</div>
                </div>
              )}
              {callState === CALL_STATES.IN_PROGRESS && (
                <div>
                  <div className="text-xl font-semibold text-white mb-2">Call In Progress</div>
                  <div className="text-2xl font-mono text-green-500 mb-2">{formatDuration(callDuration)}</div>
                  <div className="text-gray-400 text-sm">Your AI is responding...</div>
                </div>
              )}
              {callState === CALL_STATES.SUCCESS && (
                <div>
                  <div className="text-xl font-semibold text-green-500 mb-2">Test Successful!</div>
                  <div className="text-gray-400 text-sm">
                    Your AI assistant is working perfectly
                  </div>
                </div>
              )}
            </div>

            {/* Call Button */}
            {callState === CALL_STATES.IDLE && (
              <Button
                onClick={startTestCall}
                variant="primary"
                size="lg"
                className="px-8"
              >
                <PhoneCall className="w-5 h-5 mr-2" />
                Make Test Call
              </Button>
            )}
          </div>
        </div>

        {/* Setup Summary */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Setup Summary</h3>
          <div className="space-y-3 text-sm">
            {data?.businessName && (
              <div className="flex justify-between">
                <span className="text-gray-400">Business Name:</span>
                <span className="text-white font-medium">{data.businessName}</span>
              </div>
            )}
            {data?.industry && (
              <div className="flex justify-between">
                <span className="text-gray-400">Industry:</span>
                <span className="text-white font-medium capitalize">{data.industry}</span>
              </div>
            )}
            {data?.voice && (
              <div className="flex justify-between">
                <span className="text-gray-400">AI Voice:</span>
                <span className="text-white font-medium">{data.voice}</span>
              </div>
            )}
            {data?.tone && (
              <div className="flex justify-between">
                <span className="text-gray-400">Tone:</span>
                <span className="text-white font-medium capitalize">{data.tone}</span>
              </div>
            )}
            {data?.phoneOption && (
              <div className="flex justify-between">
                <span className="text-gray-400">Phone Setup:</span>
                <span className="text-white font-medium">
                  {data.phoneOption === 'new' ? 'New Number' : 'Call Forwarding'}
                </span>
              </div>
            )}
            {data?.newNumber && (
              <div className="flex justify-between">
                <span className="text-gray-400">Number:</span>
                <span className="text-white font-medium font-mono">{data.newNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button type="button" variant="ghost" onClick={onBack}>
            Back
          </Button>
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onFinish}
            disabled={callState !== CALL_STATES.SUCCESS || isLoading}
            loading={isLoading}
          >
            {isLoading ? 'Setting up...' : 'Finish Setup'}
          </Button>
        </div>

        {callState !== CALL_STATES.SUCCESS && (
          <p className="text-center text-sm text-gray-500">
            Complete the test call to finish setup
          </p>
        )}
      </div>
    </div>
  );
}
