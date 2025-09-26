// Script to clear localStorage and fix URL issues
(() => {
  console.log('🔧 Fixing Karoo Lodge URL Issues...');
  
  // Clear relevant localStorage keys
  const keys = Object.keys(localStorage);
  const karooKeys = keys.filter(key => 
    key.includes('karoo') || 
    key.includes('lodge') || 
    key.includes('gallery') || 
    key.includes('GlobalState') ||
    key.includes('karoo-gallery-state')
  );
  
  console.log('📄 Found localStorage keys:', karooKeys);
  
  if (karooKeys.length > 0) {
    karooKeys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          console.log(`🔍 Checking key: ${key}`, parsed);
        } catch (e) {
          console.log(`🔍 Non-JSON key: ${key}`, data);
        }
      }
      localStorage.removeItem(key);
      console.log(`❌ Removed: ${key}`);
    });
    
    console.log('✅ Cleared all Karoo Lodge data from localStorage');
    console.log('🔄 Refreshing page to reload with clean state...');
    window.location.reload();
  } else {
    console.log('ℹ️ No Karoo Lodge data found in localStorage');
    console.log('🔄 Refreshing page anyway to ensure clean state...');
    window.location.reload();
  }
})();
