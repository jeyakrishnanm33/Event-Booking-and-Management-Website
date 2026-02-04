import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Package } from '../../types';

// Mock initial data for services and packages
const initialServices = [
  {
    id: 'svc1',
    name: 'Wedding Planning',
    packages: [
      { id: 'p1', name: 'Basic', price: 50000, description: 'Venue Décor + Music', features: ['Venue Decoration', 'DJ & Music System'] },
      { id: 'p2', name: 'Premium', price: 150000, description: 'Décor + Music + Photography', features: ['Elaborate Venue Decoration', 'Live Band & DJ', 'Professional Photography (8 hours)'] },
    ]
  },
  {
    id: 'svc2',
    name: 'Birthday Party Planning',
    packages: [
        { id: 'p3', name: 'Premium Birthday Package', price: 40000, description: 'All-inclusive package for a memorable birthday celebration.', features: ['Themed Decoration', 'Custom Cake', 'Fun Activities', 'Return Gifts'] },
    ]
  }
];

const OrganizerServicesPage: React.FC = () => {
    const [services, setServices] = useState(initialServices);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentServiceId, setCurrentServiceId] = useState<string | null>(null);
    const [editingPackage, setEditingPackage] = useState<Package | null>(null);

    // Form state for the modal
    const [packageName, setPackageName] = useState('');
    const [packagePrice, setPackagePrice] = useState('');
    const [packageDesc, setPackageDesc] = useState('');
    const [packageFeatures, setPackageFeatures] = useState('');

    const openAddModal = (serviceId: string) => {
        resetForm();
        setCurrentServiceId(serviceId);
        setEditingPackage(null);
        setIsModalOpen(true);
    };

    const openEditModal = (serviceId: string, pkg: Package) => {
        setCurrentServiceId(serviceId);
        setEditingPackage(pkg);
        setPackageName(pkg.name);
        setPackagePrice(pkg.price.toString());
        setPackageDesc(pkg.description);
        setPackageFeatures(pkg.features.join(', '));
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setPackageName('');
        setPackagePrice('');
        setPackageDesc('');
        setPackageFeatures('');
        setCurrentServiceId(null);
        setEditingPackage(null);
    };

    const handleSavePackage = () => {
        if (!packageName || !packagePrice || !currentServiceId) {
            alert('Please fill in all required fields.');
            return;
        }

        const updatedServices = services.map(service => {
            if (service.id === currentServiceId) {
                const newPackageData: Package = {
                    id: editingPackage ? editingPackage.id : `p${Date.now()}`,
                    name: packageName,
                    price: parseFloat(packagePrice),
                    description: packageDesc,
                    features: packageFeatures.split(',').map(f => f.trim()),
                };

                if (editingPackage) {
                    // Update existing package
                    return {
                        ...service,
                        packages: service.packages.map(p => p.id === editingPackage.id ? newPackageData : p),
                    };
                } else {
                    // Add new package
                    return {
                        ...service,
                        packages: [...service.packages, newPackageData],
                    };
                }
            }
            return service;
        });
        
        setServices(updatedServices);
        closeModal();
    };
    
    const handleDeletePackage = (serviceId: string, packageId: string) => {
        if(window.confirm('Are you sure you want to delete this package?')) {
            const updatedServices = services.map(service => {
                if (service.id === serviceId) {
                    return {
                        ...service,
                        packages: service.packages.filter(p => p.id !== packageId),
                    };
                }
                return service;
            });
            setServices(updatedServices);
        }
    };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage My Services</h1>
        <Button onClick={() => alert('Add New Service functionality coming soon!')}>Add New Service</Button>
      </div>
      
      <div className="space-y-8">
        {services.map(service => (
            <Card key={service.id} className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">{service.name}</h2>
                    <Button onClick={() => openAddModal(service.id)}>Add Package</Button>
                </div>
                <div className="space-y-4">
                    {service.packages.length > 0 ? service.packages.map(pkg => (
                        <div key={pkg.id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between md:items-center bg-gray-50">
                            <div>
                                <h3 className="font-bold text-lg">{pkg.name}</h3>
                                <p className="text-gray-600">{pkg.description}</p>
                                <p className="font-semibold text-indigo-600 mt-1">₹{pkg.price.toLocaleString()}</p>
                            </div>
                            <div className="flex space-x-2 mt-4 md:mt-0">
                                <Button variant='outline' size='sm' onClick={() => openEditModal(service.id, pkg)}>Edit</Button>
                                <Button variant='secondary' size='sm' onClick={() => handleDeletePackage(service.id, pkg.id)}>Delete</Button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-gray-500">No packages found for this service. Add one to get started!</p>
                    )}
                </div>
            </Card>
        ))}
      </div>

      {/* Add/Edit Package Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6">{editingPackage ? 'Edit Package' : 'Add New Package'}</h2>
                <div className="space-y-4">
                    <Input label="Package Name" value={packageName} onChange={e => setPackageName(e.target.value)} required />
                    <Input label="Price (₹)" type="number" value={packagePrice} onChange={e => setPackagePrice(e.target.value)} required />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={packageDesc} onChange={e => setPackageDesc(e.target.value)} />
                    </div>
                    <Input label="Features (comma-separated)" value={packageFeatures} onChange={e => setPackageFeatures(e.target.value)} placeholder="e.g., Feature 1, Feature 2" />
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                    <Button variant="outline" onClick={closeModal}>Cancel</Button>
                    <Button onClick={handleSavePackage}>{editingPackage ? 'Save Changes' : 'Add Package'}</Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerServicesPage;
