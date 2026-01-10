import { 
  ArrowRight, 
  Upload, 
  Sparkles, 
  CheckCircle, 
  DollarSign,
  Calendar,
  Bell,
  FileCheck
} from 'lucide-react';

export function MilestoneFlows() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-8">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Payment Flows</h1>
          <p className="text-gray-600">Two types of milestone-based payment processing</p>
        </div>

        <div className="space-y-8">
          {/* Flow 1: GC-Triggered Milestone */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-gray-900 mb-2">GC-Triggered Milestone</h2>
              <p className="text-gray-600">Gestational Carrier submits documentation to trigger payment</p>
            </div>

            {/* Flow Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              {/* Step 1: GC Submits */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-gray-900 mb-1">GC Submits</h3>
                <p className="text-gray-600 text-sm">Uploads documents & selects milestone type</p>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </div>

              {/* Step 2: AI Verifies */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-gray-900 mb-1">AI Verifies</h3>
                <p className="text-gray-600 text-sm">Checks against contract terms & documents</p>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </div>

              {/* Step 3: IP Approves */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-gray-900 mb-1">IP Approves</h3>
                <p className="text-gray-600 text-sm">Reviews & approves (or auto-approved if enabled)</p>
              </div>
            </div>

            {/* Arrow to Final Step */}
            <div className="flex justify-center my-4">
              <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />
            </div>

            {/* Final Step: Funds Released */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-6 text-center max-w-md mx-auto">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-gray-900 mb-1">Funds Released</h3>
              <p className="text-gray-600 text-sm">Payment processed within 24 hours to GC account</p>
            </div>

            {/* Timing Info */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-500 text-xs mb-1">Typical Processing Time</p>
                <p className="text-gray-900">1-3 business days</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-500 text-xs mb-1">With Auto-Approve</p>
                <p className="text-gray-900">Same day</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-500 text-xs mb-1">Example Milestones</p>
                <p className="text-gray-900 text-sm">C-section, bed rest, travel reimbursements</p>
              </div>
            </div>
          </div>

          {/* Flow 2: Automated Milestone */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-gray-900 mb-2">Automated Monthly Milestone</h2>
              <p className="text-gray-600">Scheduled recurring payments processed automatically</p>
            </div>

            {/* Flow Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              {/* Step 1: Scheduled Payment */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-gray-900 mb-1">Scheduled Date</h3>
                <p className="text-gray-600 text-sm">Monthly payment date arrives</p>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </div>

              {/* Step 2: Auto Verification */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileCheck className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-gray-900 mb-1">Auto Check</h3>
                <p className="text-gray-600 text-sm">System verifies pregnancy status & contract</p>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </div>

              {/* Step 3: IP Notified */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-gray-900 mb-1">IP Notified</h3>
                <p className="text-gray-600 text-sm">Notification sent (no action required)</p>
              </div>
            </div>

            {/* Arrow to Final Step */}
            <div className="flex justify-center my-4">
              <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />
            </div>

            {/* Final Step: Funds Released */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-6 text-center max-w-md mx-auto">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-gray-900 mb-1">Funds Released</h3>
              <p className="text-gray-600 text-sm">Automatic payment to GC account on scheduled date</p>
            </div>

            {/* Timing Info */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-500 text-xs mb-1">Processing Time</p>
                <p className="text-gray-900">Same day</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-500 text-xs mb-1">IP Action Required</p>
                <p className="text-gray-900">None (notification only)</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-500 text-xs mb-1">Example Milestones</p>
                <p className="text-gray-900 text-sm">Monthly base comp, allowances</p>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-gray-900 mb-6">Flow Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-600 text-sm">Feature</th>
                    <th className="text-left py-3 px-4 text-gray-600 text-sm">GC-Triggered</th>
                    <th className="text-left py-3 px-4 text-gray-600 text-sm">Automated</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">GC Action Required</td>
                    <td className="py-3 px-4 text-gray-600">✓ Submit documents</td>
                    <td className="py-3 px-4 text-gray-600">✗ None</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">AI Verification</td>
                    <td className="py-3 px-4 text-gray-600">✓ Reviews docs & contract</td>
                    <td className="py-3 px-4 text-gray-600">✓ Verifies contract & status</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">IP Approval</td>
                    <td className="py-3 px-4 text-gray-600">Required (or auto if enabled)</td>
                    <td className="py-3 px-4 text-gray-600">Not required</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Processing Speed</td>
                    <td className="py-3 px-4 text-gray-600">1-3 days (same day if auto)</td>
                    <td className="py-3 px-4 text-gray-600">Same day</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-700">Common Use Cases</td>
                    <td className="py-3 px-4 text-gray-600">One-time events, reimbursements</td>
                    <td className="py-3 px-4 text-gray-600">Monthly payments, allowances</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
