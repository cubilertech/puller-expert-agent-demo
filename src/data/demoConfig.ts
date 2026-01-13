import { IndustryVertical, Task, TaskData } from '@/types';
import { retailEcommerceTasks, retailEcommerceTaskData } from './industries/retailEcommerce';
import { groceryMassMerchTasks, groceryMassMerchTaskData } from './industries/groceryMassMerch';
import { cpgConsumerBrandsTasks, cpgConsumerBrandsTaskData } from './industries/cpgConsumerBrands';
import { hospitalityRestaurantsTasks, hospitalityRestaurantsTaskData } from './industries/hospitalityRestaurants';
import { fashionShoesTasks, fashionShoesTaskData } from './industries/fashionShoes';
import { mediaEntertainmentTasks, mediaEntertainmentTaskData } from './industries/mediaEntertainment';

// ============================================
// DEMO CONFIGURATION & DATA ORCHESTRATION
// ============================================

export interface DemoConfig {
  mode: 'milk-run' | 'industry-specific' | 'full-showcase';
  selectedIndustry?: IndustryVertical;
  taskCount: number;
  showGhostTasks: boolean;
  simulateRealTime: boolean;
}

export const demoPresets: Record<string, DemoConfig> = {
  'quick-demo': {
    mode: 'milk-run',
    taskCount: 3,
    showGhostTasks: false,
    simulateRealTime: false
  },
  'retail-focus': {
    mode: 'industry-specific',
    selectedIndustry: 'retail-ecommerce',
    taskCount: 5,
    showGhostTasks: true,
    simulateRealTime: true
  },
  'grocery-focus': {
    mode: 'industry-specific',
    selectedIndustry: 'grocery-mass-merch',
    taskCount: 5,
    showGhostTasks: true,
    simulateRealTime: true
  },
  'cpg-focus': {
    mode: 'industry-specific',
    selectedIndustry: 'cpg-consumer-brands',
    taskCount: 5,
    showGhostTasks: true,
    simulateRealTime: true
  },
  'hospitality-focus': {
    mode: 'industry-specific',
    selectedIndustry: 'hospitality-restaurants',
    taskCount: 5,
    showGhostTasks: true,
    simulateRealTime: true
  },
  'fashion-focus': {
    mode: 'industry-specific',
    selectedIndustry: 'fashion-shoes',
    taskCount: 5,
    showGhostTasks: true,
    simulateRealTime: true
  },
  'media-focus': {
    mode: 'industry-specific',
    selectedIndustry: 'media-entertainment',
    taskCount: 5,
    showGhostTasks: true,
    simulateRealTime: true
  },
  'full-showcase': {
    mode: 'full-showcase',
    taskCount: 10,
    showGhostTasks: true,
    simulateRealTime: true
  }
};

// Industry display configuration
export const industryConfig: Record<IndustryVertical, { label: string; color: string; icon: string }> = {
  'retail-ecommerce': { label: 'Retail & eCommerce', color: 'text-primary', icon: '🛒' },
  'grocery-mass-merch': { label: 'Grocery & Mass Merch', color: 'text-success', icon: '🥬' },
  'cpg-consumer-brands': { label: 'CPG & Consumer Brands', color: 'text-warning', icon: '📦' },
  'hospitality-restaurants': { label: 'Hospitality & Restaurants', color: 'text-info', icon: '🍽️' },
  'fashion-shoes': { label: 'Fashion & Shoes', color: 'text-pink-500', icon: '👗' },
  'media-entertainment': { label: 'Media & Entertainment', color: 'text-violet-500', icon: '🎬' }
};

// Aggregate all tasks from all industries
export const allIndustryTasks: Task[] = [
  ...retailEcommerceTasks,
  ...groceryMassMerchTasks,
  ...cpgConsumerBrandsTasks,
  ...hospitalityRestaurantsTasks,
  ...fashionShoesTasks,
  ...mediaEntertainmentTasks
];

// Aggregate all task data from all industries
export const allTaskData: Record<string, TaskData> = {
  ...retailEcommerceTaskData,
  ...groceryMassMerchTaskData,
  ...cpgConsumerBrandsTaskData,
  ...hospitalityRestaurantsTaskData,
  ...fashionShoesTaskData,
  ...mediaEntertainmentTaskData
};

// Get tasks filtered by industry
export function getTasksByIndustry(industry: IndustryVertical): Task[] {
  return allIndustryTasks.filter(task => task.industry === industry);
}

// Get tasks for a specific demo preset
export function getTasksForDemo(preset: keyof typeof demoPresets): Task[] {
  const config = demoPresets[preset];
  
  if (config.mode === 'industry-specific' && config.selectedIndustry) {
    return getTasksByIndustry(config.selectedIndustry).slice(0, config.taskCount);
  }
  
  if (config.mode === 'milk-run') {
    // Return a mix across industries for variety
    const milkRunTasks: Task[] = [];
    const industries = Object.keys(industryConfig) as IndustryVertical[];
    
    for (let i = 0; i < config.taskCount && i < industries.length; i++) {
      const industryTasks = getTasksByIndustry(industries[i]);
      if (industryTasks.length > 0) {
        milkRunTasks.push(industryTasks[0]);
      }
    }
    return milkRunTasks;
  }
  
  // Full showcase - return mix of industries
  return allIndustryTasks.slice(0, config.taskCount);
}

// Get task data for a specific task ID
export function getTaskData(taskId: string): TaskData | null {
  return allTaskData[taskId] || null;
}

// Demo summary statistics
export const demoStats = {
  totalTasks: allIndustryTasks.length,
  industries: Object.keys(industryConfig).length,
  tasksByIndustry: {
    'retail-ecommerce': retailEcommerceTasks.length,
    'grocery-mass-merch': groceryMassMerchTasks.length,
    'cpg-consumer-brands': cpgConsumerBrandsTasks.length,
    'hospitality-restaurants': hospitalityRestaurantsTasks.length,
    'fashion-shoes': fashionShoesTasks.length,
    'media-entertainment': mediaEntertainmentTasks.length
  }
};
