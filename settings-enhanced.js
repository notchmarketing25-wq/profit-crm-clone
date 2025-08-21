// Enhanced Settings Management System
class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.initializeSettings();
        this.bindEvents();
    }

    // Load settings from localStorage
    loadSettings() {
        const defaultSettings = {
            general: {
                systemName: 'Profit CRM',
                systemVersion: 'الإصدار 5',
                systemDescription: 'إصدار قادة السوق العقاري',
                defaultLanguage: 'ar',
                timezone: 'Asia/Riyadh',
                dateFormat: 'dd-mm-yyyy'
            },
            branding: {
                companyName: 'Vice',
                systemBadge: 'CRM',
                primaryColor: '#667eea',
                secondaryColor: '#764ba2',
                backgroundColor: '#f8f9fa',
                logoUrl: null
            },
            security: {
                requireStrongPassword: true,
                minPasswordLength: 8,
                passwordExpiry: 90,
                sessionTimeout: 60,
                enableTwoFactor: false,
                logLoginAttempts: true
            },
            backup: {
                autoBackupFrequency: 'weekly',
                lastBackup: null,
                backupLocation: 'local'
            }
        };

        const savedSettings = localStorage.getItem('crmSettings');
        return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
    }

    // Save settings to localStorage
    saveSettings() {
        try {
            localStorage.setItem('crmSettings', JSON.stringify(this.settings));
            this.applySettings();
            this.showNotification('تم حفظ الإعدادات بنجاح', 'success');
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showNotification('خطأ في حفظ الإعدادات', 'error');
        }
    }

    // Initialize settings on page load
    initializeSettings() {
        this.applySettings();
        this.populateForm();
    }

    // Apply settings to the interface
    applySettings() {
        // Apply branding
        this.updateBranding();
        
        // Apply colors
        this.updateColors();
        
        // Apply general settings
        this.updateGeneralSettings();
    }

    // Update branding elements
    updateBranding() {
        const { companyName, systemBadge } = this.settings.branding;
        
        // Update main logo
        const systemNameElements = document.querySelectorAll('#systemName, #mobileSysName, #previewCompanyName');
        systemNameElements.forEach(el => {
            if (el) el.textContent = companyName;
        });

        const systemBadgeElements = document.querySelectorAll('#systemBadge, #mobileSysBadge, #previewBadge');
        systemBadgeElements.forEach(el => {
            if (el) el.textContent = systemBadge;
        });

        // Update page title
        document.title = `${companyName} ${systemBadge} - الإعدادات`;
    }

    // Update color scheme
    updateColors() {
        const { primaryColor, secondaryColor, backgroundColor } = this.settings.branding;
        
        // Create or update CSS custom properties
        const root = document.documentElement;
        root.style.setProperty('--primary-color', primaryColor);
        root.style.setProperty('--secondary-color', secondaryColor);
        root.style.setProperty('--background-color', backgroundColor);

        // Update color preview
        const colorPreview = document.getElementById('colorPreview');
        if (colorPreview) {
            colorPreview.style.background = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
        }

        // Update preview buttons
        const primaryBtn = document.querySelector('.preview-btn.primary');
        const secondaryBtn = document.querySelector('.preview-btn.secondary');
        
        if (primaryBtn) {
            primaryBtn.style.background = `rgba(255, 255, 255, 0.2)`;
            primaryBtn.style.border = `1px solid rgba(255, 255, 255, 0.3)`;
        }
        
        if (secondaryBtn) {
            secondaryBtn.style.background = `rgba(255, 255, 255, 0.1)`;
            secondaryBtn.style.border = `1px solid rgba(255, 255, 255, 0.2)`;
        }
    }

    // Update general settings
    updateGeneralSettings() {
        const { systemName, systemDescription } = this.settings.general;
        
        // Update welcome message on login page
        const welcomeElements = document.querySelectorAll('.welcome-section h1');
        welcomeElements.forEach(el => {
            if (el) el.textContent = `مرحباً بك في نظام ${systemName}`;
        });

        const subtitleElements = document.querySelectorAll('.subtitle');
        subtitleElements.forEach(el => {
            if (el) el.textContent = systemDescription;
        });
    }

    // Populate form with current settings
    populateForm() {
        // General settings
        this.setInputValue('systemNameInput', this.settings.general.systemName);
        this.setInputValue('systemVersion', this.settings.general.systemVersion);
        this.setInputValue('systemDescription', this.settings.general.systemDescription);
        this.setInputValue('defaultLanguage', this.settings.general.defaultLanguage);
        this.setInputValue('timezone', this.settings.general.timezone);
        this.setInputValue('dateFormat', this.settings.general.dateFormat);

        // Branding settings
        this.setInputValue('companyName', this.settings.branding.companyName);
        this.setInputValue('systemBadgeText', this.settings.branding.systemBadge);
        this.setInputValue('primaryColor', this.settings.branding.primaryColor);
        this.setInputValue('primaryColorText', this.settings.branding.primaryColor);
        this.setInputValue('secondaryColor', this.settings.branding.secondaryColor);
        this.setInputValue('secondaryColorText', this.settings.branding.secondaryColor);
        this.setInputValue('backgroundColor', this.settings.branding.backgroundColor);
        this.setInputValue('backgroundColorText', this.settings.branding.backgroundColor);

        // Security settings
        this.setCheckboxValue('requireStrongPassword', this.settings.security.requireStrongPassword);
        this.setInputValue('minPasswordLength', this.settings.security.minPasswordLength);
        this.setInputValue('passwordExpiry', this.settings.security.passwordExpiry);
        this.setInputValue('sessionTimeout', this.settings.security.sessionTimeout);
        this.setCheckboxValue('enableTwoFactor', this.settings.security.enableTwoFactor);
        this.setCheckboxValue('logLoginAttempts', this.settings.security.logLoginAttempts);

        // Backup settings
        this.setInputValue('autoBackupFrequency', this.settings.backup.autoBackupFrequency);
    }

    // Helper function to set input value
    setInputValue(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.value = value;
        }
    }

    // Helper function to set checkbox value
    setCheckboxValue(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.checked = value;
        }
    }

    // Bind event listeners
    bindEvents() {
        // Real-time preview updates
        this.bindRealtimeUpdates();
        
        // Tab switching
        this.bindTabSwitching();
        
        // File upload
        this.bindFileUpload();
        
        // Form submissions
        this.bindFormSubmissions();
    }

    // Bind real-time preview updates
    bindRealtimeUpdates() {
        // Company name preview
        const companyNameInput = document.getElementById('companyName');
        if (companyNameInput) {
            companyNameInput.addEventListener('input', (e) => {
                const previewElement = document.getElementById('previewCompanyName');
                if (previewElement) {
                    previewElement.textContent = e.target.value || 'Vice';
                }
            });
        }

        // System badge preview
        const systemBadgeInput = document.getElementById('systemBadgeText');
        if (systemBadgeInput) {
            systemBadgeInput.addEventListener('input', (e) => {
                const previewElement = document.getElementById('previewBadge');
                if (previewElement) {
                    previewElement.textContent = e.target.value || 'CRM';
                }
            });
        }

        // Color preview updates with text input sync
        const colorInputs = ['primaryColor', 'secondaryColor', 'backgroundColor'];
        colorInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            const textInput = document.getElementById(inputId + 'Text');
            
            if (input) {
                input.addEventListener('input', (e) => {
                    if (textInput) {
                        textInput.value = e.target.value;
                    }
                    this.updateColorPreview();
                });
            }
            
            if (textInput) {
                textInput.addEventListener('input', (e) => {
                    const colorValue = e.target.value;
                    if (this.isValidHexColor(colorValue)) {
                        if (input) {
                            input.value = colorValue;
                        }
                        this.updateColorPreview();
                    }
                });
            }
        });
    }

    // Validate hex color
    isValidHexColor(hex) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }

    // Update color preview in real-time
    updateColorPreview() {
        const primaryColor = document.getElementById('primaryColor')?.value || '#667eea';
        const secondaryColor = document.getElementById('secondaryColor')?.value || '#764ba2';
        
        const colorPreview = document.getElementById('colorPreview');
        if (colorPreview) {
            colorPreview.style.background = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
        }
    }

    // Bind tab switching
    bindTabSwitching() {
        const tabButtons = document.querySelectorAll('.settings-tab');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
                if (tabName) {
                    this.switchTab(tabName);
                }
            });
        });
    }

    // Switch settings tab
    switchTab(tabName) {
        // Remove active class from all tabs
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Hide all tab contents
        document.querySelectorAll('.settings-tab-content').forEach(content => {
            content.style.display = 'none';
        });

        // Show selected tab
        const selectedTab = document.querySelector(`[onclick*="${tabName}"]`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }

        const selectedContent = document.getElementById(`${tabName}-tab`);
        if (selectedContent) {
            selectedContent.style.display = 'block';
            selectedContent.classList.add('fade-in');
        }
    }

    // Bind file upload
    bindFileUpload() {
        const logoUpload = document.getElementById('logoUpload');
        if (logoUpload) {
            logoUpload.addEventListener('change', (e) => {
                this.handleLogoUpload(e);
            });
        }

        const backupFile = document.getElementById('backupFile');
        if (backupFile) {
            backupFile.addEventListener('change', (e) => {
                this.handleBackupRestore(e);
            });
        }
    }

    // Handle logo upload with validation
    handleLogoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
            if (!validTypes.includes(file.type)) {
                this.showNotification('نوع الملف غير مدعوم. يرجى اختيار PNG أو JPG أو SVG', 'error');
                return;
            }

            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                this.showNotification('حجم الملف كبير جداً. الحد الأقصى 2 ميجابايت', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    this.settings.branding.logoUrl = e.target.result;
                    this.updateLogoPreview(e.target.result);
                    this.showNotification('تم رفع الشعار بنجاح', 'success');
                    
                    // Update file name display
                    const fileNameElement = document.getElementById('selectedFileName');
                    if (fileNameElement) {
                        fileNameElement.textContent = `تم اختيار: ${file.name}`;
                    }
                } catch (error) {
                    console.error('Error processing logo:', error);
                    this.showNotification('خطأ في معالجة الشعار', 'error');
                }
            };
            reader.readAsDataURL(file);
        }
    }

    // Update logo preview
    updateLogoPreview(logoUrl) {
        const previewContainer = document.getElementById('logoPreviewContainer');
        if (previewContainer && logoUrl) {
            previewContainer.innerHTML = `<img src="${logoUrl}" alt="Logo" style="height: 40px; width: auto; max-width: 200px;">`;
        }
    }

    // Handle backup restore
    handleBackupRestore(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const backupData = JSON.parse(e.target.result);
                    this.restoreFromBackup(backupData);
                } catch (error) {
                    console.error('Error parsing backup file:', error);
                    this.showNotification('خطأ في ملف النسخة الاحتياطية', 'error');
                }
            };
            reader.readAsText(file);
        }
    }

    // Restore from backup
    restoreFromBackup(backupData) {
        if (confirm('هل أنت متأكد من استعادة النسخة الاحتياطية؟ سيتم استبدال الإعدادات الحالية.')) {
            try {
                this.settings = { ...this.settings, ...backupData.settings || backupData };
                this.saveSettings();
                this.populateForm();
                this.showNotification('تم استعادة النسخة الاحتياطية بنجاح', 'success');
                setTimeout(() => {
                    location.reload();
                }, 2000);
            } catch (error) {
                console.error('Error restoring backup:', error);
                this.showNotification('خطأ في استعادة النسخة الاحتياطية', 'error');
            }
        }
    }

    // Bind form submissions
    bindFormSubmissions() {
        // Save all settings
        window.saveAllSettings = () => {
            this.collectAllSettings();
            this.saveSettings();
        };

        // Reset to defaults
        window.resetToDefaults = () => {
            if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟')) {
                localStorage.removeItem('crmSettings');
                this.showNotification('تم إعادة تعيين الإعدادات', 'success');
                setTimeout(() => {
                    location.reload();
                }, 1500);
            }
        };

        // Create backup
        window.createBackup = () => {
            this.createBackup();
        };

        // Save auto backup settings
        window.saveAutoBackupSettings = () => {
            const frequency = document.getElementById('autoBackupFrequency')?.value;
            if (frequency) {
                this.settings.backup.autoBackupFrequency = frequency;
                this.saveSettings();
                this.showNotification('تم حفظ إعدادات النسخ التلقائي', 'success');
            }
        };

        // Show add user modal
        window.showAddUserModal = () => {
            this.showNotification('سيتم فتح نافذة إضافة مستخدم جديد', 'info');
        };
    }

    // Collect all settings from form
    collectAllSettings() {
        try {
            // General settings
            this.settings.general.systemName = document.getElementById('systemNameInput')?.value || 'Profit CRM';
            this.settings.general.systemVersion = document.getElementById('systemVersion')?.value || 'الإصدار 5';
            this.settings.general.systemDescription = document.getElementById('systemDescription')?.value || 'إصدار قادة السوق العقاري';
            this.settings.general.defaultLanguage = document.getElementById('defaultLanguage')?.value || 'ar';
            this.settings.general.timezone = document.getElementById('timezone')?.value || 'Asia/Riyadh';
            this.settings.general.dateFormat = document.getElementById('dateFormat')?.value || 'dd-mm-yyyy';

            // Branding settings
            this.settings.branding.companyName = document.getElementById('companyName')?.value || 'Vice';
            this.settings.branding.systemBadge = document.getElementById('systemBadgeText')?.value || 'CRM';
            this.settings.branding.primaryColor = document.getElementById('primaryColor')?.value || '#667eea';
            this.settings.branding.secondaryColor = document.getElementById('secondaryColor')?.value || '#764ba2';
            this.settings.branding.backgroundColor = document.getElementById('backgroundColor')?.value || '#f8f9fa';

            // Security settings
            this.settings.security.requireStrongPassword = document.getElementById('requireStrongPassword')?.checked || false;
            this.settings.security.minPasswordLength = parseInt(document.getElementById('minPasswordLength')?.value) || 8;
            this.settings.security.passwordExpiry = parseInt(document.getElementById('passwordExpiry')?.value) || 90;
            this.settings.security.sessionTimeout = parseInt(document.getElementById('sessionTimeout')?.value) || 60;
            this.settings.security.enableTwoFactor = document.getElementById('enableTwoFactor')?.checked || false;
            this.settings.security.logLoginAttempts = document.getElementById('logLoginAttempts')?.checked || true;

            // Backup settings
            this.settings.backup.autoBackupFrequency = document.getElementById('autoBackupFrequency')?.value || 'weekly';
        } catch (error) {
            console.error('Error collecting settings:', error);
            this.showNotification('خطأ في جمع الإعدادات', 'error');
        }
    }

    // Create backup
    createBackup() {
        try {
            const backupData = {
                settings: this.settings,
                timestamp: new Date().toISOString(),
                version: '1.0',
                type: 'manual'
            };

            const dataStr = JSON.stringify(backupData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `crm-backup-${new Date().toISOString().split('T')[0]}.json`;
            link.click();

            // Update last backup time
            this.settings.backup.lastBackup = new Date().toISOString();
            this.saveSettings();
            
            this.showNotification('تم إنشاء النسخة الاحتياطية وتحميلها', 'success');
        } catch (error) {
            console.error('Error creating backup:', error);
            this.showNotification('خطأ في إنشاء النسخة الاحتياطية', 'error');
        }
    }

    // Enhanced notification system
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };

        notification.innerHTML = `
            <span style="font-size: 1.2rem; margin-left: 8px;">${icons[type] || icons.info}</span>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    }
}

// Global function for tab switching (called from HTML)
function switchSettingsTab(tabName) {
    if (window.settingsManager) {
        window.settingsManager.switchTab(tabName);
    }
}

// Initialize settings manager when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.settingsManager = new SettingsManager();
});

// Export settings for use in other files
window.getSettings = function() {
    return window.settingsManager ? window.settingsManager.settings : null;
};

// Apply settings to other pages
window.applyGlobalSettings = function() {
    if (window.settingsManager) {
        window.settingsManager.applySettings();
    }
};
