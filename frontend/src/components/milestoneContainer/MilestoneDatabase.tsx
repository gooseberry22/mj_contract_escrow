import { 
  CheckCircle, 
  Calendar, 
  DollarSign, 
  FileText,
  Heart,
  Stethoscope,
  Baby,
  Home,
  TrendingUp
} from 'lucide-react';
import { MILESTONE_DATABASE, type MilestoneDefinition } from '../../data/milestoneData';

export function MilestoneDatabase() {
  const milestones = MILESTONE_DATABASE;

  const categories = [
    { name: 'Pre-Pregnancy', icon: FileText, color: 'text-blue-600' },
    { name: 'Pregnancy Confirmation', icon: Heart, color: 'text-pink-600' },
    { name: 'Pregnancy Progression', icon: TrendingUp, color: 'text-green-600' },
    { name: 'Delivery', icon: Baby, color: 'text-purple-600' },
    { name: 'Postpartum', icon: Home, color: 'text-orange-600' },
    { name: 'Allowances', icon: DollarSign, color: 'text-gray-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-8">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Milestone Database</h1>
          <p className="text-gray-600">Comprehensive list of all payment-triggering events in the surrogacy journey</p>
        </div>

        {/* Category Navigation */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <button
                key={idx}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors whitespace-nowrap"
              >
                <IconComponent className={`w-4 h-4 ${cat.color}`} />
                <span className="text-gray-700 text-sm">{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Milestones Table */}
        <div className="space-y-6">
          {categories.map((category) => {
            const categoryMilestones = milestones.filter(m => m.category === category.name);
            const IconComponent = category.icon;
            
            return (
              <div key={category.name} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Category Header */}
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center gap-2">
                    <IconComponent className={`w-5 h-5 ${category.color}`} />
                    <h2 className="text-gray-900">{category.name}</h2>
                    <span className="text-gray-500 text-sm">({categoryMilestones.length} milestones)</span>
                  </div>
                </div>

                {/* Milestones */}
                <div className="divide-y divide-gray-100">
                  {categoryMilestones.map((milestone) => (
                    <div key={milestone.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left: Overview */}
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-gray-500 text-sm">{milestone.id}</span>
                                <h3 className="text-gray-900">{milestone.name}</h3>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {milestone.timing}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  {milestone.typicalAmount}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* GC Perspective */}
                          <div className="mb-3">
                            <p className="text-gray-700 text-sm mb-1">Gestational Carrier:</p>
                            <ul className="space-y-1">
                              {milestone.gcPerspective.map((item, idx) => (
                                <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                                  <span className="text-green-500 mt-0.5">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* IP Perspective */}
                          <div>
                            <p className="text-gray-700 text-sm mb-1">Intended Parents:</p>
                            <ul className="space-y-1">
                              {milestone.ipPerspective.map((item, idx) => (
                                <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                                  <span className="text-blue-500 mt-0.5">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Right: Requirements */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="mb-3">
                            <p className="text-gray-700 text-sm mb-2">Required Documents:</p>
                            <ul className="space-y-1">
                              {milestone.documentsRequired.map((doc, idx) => (
                                <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                                  <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                  <span>{doc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="pt-3 border-t border-gray-200">
                            <p className="text-gray-500 text-xs">Contract Reference: {milestone.contractClause}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}