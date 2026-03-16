export const aiConfig = {
  application: {
    enableClaudeAI: true,
    enableOfferEngine: true,
    enableQualificationFlow: true,
    steps: [
      'customer-type',
      'business-info', 
      'qualification',
      'offers',
      'contract'
    ],
    demoMode: import.meta.env.VITE_DEMO_MODE === 'true'
  }
};

export default aiConfig;
