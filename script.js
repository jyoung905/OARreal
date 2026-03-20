const steps = [...document.querySelectorAll('.form-step')];
const form = document.getElementById('intakeForm');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const progressBar = document.getElementById('progressBar');
const progressLabel = document.getElementById('progressLabel');
const resultPanel = document.getElementById('resultPanel');
const restartBtn = document.getElementById('restartBtn');
const stepKickers = ['Contact', 'Accident basics', 'Impact', 'Current status', 'Consent'];

let currentStep = 0;

function setStep(index) {
  currentStep = index;
  steps.forEach((step, i) => step.classList.toggle('active', i === currentStep));
  prevBtn.classList.toggle('hidden', currentStep === 0);
  nextBtn.classList.toggle('hidden', currentStep === steps.length - 1);
  submitBtn.classList.toggle('hidden', currentStep !== steps.length - 1);
  const progress = ((currentStep + 1) / steps.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressLabel.textContent = `Step ${currentStep + 1} of ${steps.length} · ${stepKickers[currentStep] || ''}`;
}

function validateCurrentStep() {
  const currentSection = steps[currentStep];
  const fields = [...currentSection.querySelectorAll('input, textarea, select')];

  const requiredRadioGroups = new Set(
    fields
      .filter((field) => field.type === 'radio' && field.required)
      .map((field) => field.name)
  );

  for (const groupName of requiredRadioGroups) {
    if (!document.querySelector(`input[name="${groupName}"]:checked`)) {
      alert('Please choose an option before continuing.');
      return false;
    }
  }

  const requiredCheckboxes = fields.filter((field) => field.type === 'checkbox' && field.required);
  for (const field of requiredCheckboxes) {
    if (!field.checked) {
      alert('Please confirm each required checkbox before continuing.');
      return false;
    }
  }

  for (const field of fields) {
    if (field.type === 'radio' || field.type === 'checkbox' || field.type === 'file') continue;
    if (!field.checkValidity()) {
      field.reportValidity();
      return false;
    }
  }

  return true;
}

function submitLead() {
  const formData = new FormData(form);
  formData.append('sourcePage', window.location.pathname);
  return fetch('/api/intake', {
    method: 'POST',
    body: formData
  }).then(async (response) => {
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.error || 'Submission failed. Please try again.');
    }
    return result;
  });
}

nextBtn.addEventListener('click', () => {
  if (!validateCurrentStep()) return;
  setStep(Math.min(currentStep + 1, steps.length - 1));
});

prevBtn.addEventListener('click', () => setStep(Math.max(currentStep - 1, 0)));

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!validateCurrentStep()) return;

  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  try {
    await submitLead();
    form.classList.add('hidden');
    resultPanel.classList.remove('hidden');
    progressLabel.textContent = 'Complete';
    progressBar.style.width = '100%';
  } catch (error) {
    alert(error.message || 'There was a problem submitting your inquiry.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
  }
});

restartBtn.addEventListener('click', () => {
  form.reset();
  form.classList.remove('hidden');
  resultPanel.classList.add('hidden');
  setStep(0);
});

setStep(0);
