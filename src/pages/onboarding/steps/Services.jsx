import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Briefcase, Plus, Trash2 } from 'lucide-react';

export function Services({ data, onNext, onBack, onSkip }) {
  const [services, setServices] = useState(
    data?.services || [
      { id: 1, name: '', duration: '30' }
    ]
  );
  const [errors, setErrors] = useState({});

  const addService = () => {
    const newId = Math.max(...services.map(s => s.id), 0) + 1;
    setServices([...services, { id: newId, name: '', duration: '30' }]);
  };

  const removeService = (id) => {
    if (services.length > 1) {
      setServices(services.filter(s => s.id !== id));
      // Clear errors for removed service
      const newErrors = { ...errors };
      delete newErrors[`name_${id}`];
      delete newErrors[`duration_${id}`];
      setErrors(newErrors);
    }
  };

  const updateService = (id, field, value) => {
    setServices(services.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ));
    // Clear error for this field
    const errorKey = `${field}_${id}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    services.forEach(service => {
      if (!service.name.trim()) {
        newErrors[`name_${service.id}`] = 'Service name is required';
      }

      const duration = parseInt(service.duration);
      if (!duration || duration <= 0) {
        newErrors[`duration_${service.id}`] = 'Duration must be greater than 0';
      }
    });

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext({ services });
  };

  return (
    <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Services</h2>
            <p className="text-gray-400 text-sm mt-1">
              Add services your business offers
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="p-4 bg-gray-800 rounded-lg border border-gray-700"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-4">
                  {/* Service Name */}
                  <Input
                    label={`Service ${index + 1} Name`}
                    type="text"
                    value={service.name}
                    onChange={(e) => updateService(service.id, 'name', e.target.value)}
                    placeholder="e.g., Haircut, Consultation, Appointment"
                    error={errors[`name_${service.id}`]}
                    required
                  />

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Duration (minutes) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={service.duration}
                      onChange={(e) => updateService(service.id, 'duration', e.target.value)}
                      min="1"
                      placeholder="30"
                      className="w-full px-4 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors[`duration_${service.id}`] && (
                      <p className="mt-1 text-sm text-red-500">{errors[`duration_${service.id}`]}</p>
                    )}
                  </div>
                </div>

                {/* Remove Button */}
                {services.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeService(service.id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors mt-8"
                    title="Remove service"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Service Button */}
        <Button
          type="button"
          variant="outline"
          onClick={addService}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Another Service
        </Button>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button type="button" variant="ghost" onClick={onBack}>
            Back
          </Button>
          <div className="flex gap-3">
            {onSkip && (
              <Button type="button" variant="outline" onClick={onSkip}>
                Skip
              </Button>
            )}
            <Button type="submit" variant="primary" size="lg">
              Continue
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
