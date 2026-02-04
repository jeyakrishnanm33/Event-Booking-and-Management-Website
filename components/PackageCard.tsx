import React from 'react';
import { Package } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';

interface PackageCardProps {
  serviceId: string;
  packageInfo: Package;
  onSelect: (pkg: Package) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ serviceId, packageInfo, onSelect }) => {
  return (
    <Card className="flex flex-col p-6 border-2 border-gray-200 hover:border-indigo-500 transition">
      <h3 className="text-xl font-bold text-indigo-700">{packageInfo.name}</h3>
      <p className="text-3xl font-extrabold text-gray-900 my-4">₹{packageInfo.price.toLocaleString()}</p>
      <p className="text-gray-600 mb-4">{packageInfo.description}</p>
      <ul className="space-y-2 text-gray-700 mb-6">
        {packageInfo.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <Button onClick={() => onSelect(packageInfo)} className="w-full">
          Select Package
        </Button>
      </div>
    </Card>
  );
};

export default PackageCard;
