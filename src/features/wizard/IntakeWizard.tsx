import React, { useState } from 'react';
import { usePlannerStore, AppTheme } from '../../lib/store';
import {
  CITY_TIERS,
  CITY_TIER_LABELS,
  WEDDING_FUNCTIONS,
  WEDDING_FUNCTION_LABELS,
  WEDDING_VIBES,
  WEDDING_VIBE_LABELS,
  USER_PRIORITIES,
  USER_PRIORITY_LABELS,
  CityTier,
  WeddingFunction,
  WeddingVibe,
  UserPriority,
} from '../../domain/constants';
import { WeddingIntake } from '../../domain/types';
import { WeddingIntakeSchema } from '../../domain/schemas';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Mandala } from '../../components/ui/Mandala';
import { triggerConfetti } from '../../lib/confetti';
import { isSpeechRecognitionSupported, startSpeechRecognition } from '../../lib/speech';
import {
  Calendar,
  Users,
  IndianRupee,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Mic,
  MicOff,
  Check,
  Heart,
} from 'lucide-react';

export const IntakeWizard: React.FC = () => {
  const { setIntake, setTheme } = usePlannerStore();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Form State
  const [coupleNames, setCoupleNames] = useState('Aarav & Simran');
  const [weddingDate, setWeddingDate] = useState('2026-11-28');
  const [cityTier, setCityTier] = useState<CityTier>('tier_1');
  const [cityName, setCityName] = useState('New Delhi');
  const [guestCount, setGuestCount] = useState<number>(300);
  const [totalBudgetINR, setTotalBudgetINR] = useState<number>(3000000);
  const [selectedFunctions, setSelectedFunctions] = useState<WeddingFunction[]>([
    'mehendi',
    'sangeet',
    'wedding',
    'reception',
  ]);
  const [vibe, setVibe] = useState<WeddingVibe>('royal_heritage');
  const [priorities, setPriorities] = useState<UserPriority[]>([
    'grand_venue',
    'culinary_feast',
    'cinematic_photography',
  ]);
  const [specialNotes, setSpecialNotes] = useState(
    'Family prefers outdoor heritage lawn for pheras and acoustic Bollywood music.'
  );

  const toggleFunction = (func: WeddingFunction) => {
    setSelectedFunctions((prev) =>
      prev.includes(func) ? prev.filter((f) => f !== func) : [...prev, func]
    );
  };

  const togglePriority = (prio: UserPriority) => {
    setPriorities((prev) =>
      prev.includes(prio) ? prev.filter((p) => p !== prio) : [...prev, prio]
    );
  };

  const handleVibeSelect = (v: WeddingVibe) => {
    setVibe(v);
    const theme = WEDDING_VIBE_LABELS[v]?.defaultTheme as AppTheme;
    if (theme) setTheme(theme);
  };

  const handleVoiceInput = () => {
    if (isListening) return;
    setSpeechError(null);
    setIsListening(true);

    const recognition = startSpeechRecognition(
      (transcript) => {
        setSpecialNotes((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      },
      (err) => {
        setSpeechError(err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (!recognition) {
      setIsListening(false);
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!weddingDate) newErrors.weddingDate = 'Please select a wedding date';
      if (!cityTier) newErrors.cityTier = 'Please select a wedding city tier';
    } else if (currentStep === 2) {
      if (!guestCount || guestCount < 20) newErrors.guestCount = 'Minimum 20 guests required';
      if (!totalBudgetINR || totalBudgetINR < 200000)
        newErrors.totalBudgetINR = 'Minimum budget is ₹2,00,000';
    } else if (currentStep === 3) {
      if (selectedFunctions.length === 0)
        newErrors.selectedFunctions = 'Please select at least one wedding function';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleFinalSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalSubmit = () => {
    const rawData: WeddingIntake = {
      coupleNames,
      weddingDate,
      cityTier,
      cityName,
      guestCount,
      totalBudgetINR,
      selectedFunctions,
      vibe,
      priorities,
      specialNotes,
    };

    const parsed = WeddingIntakeSchema.safeParse(rawData);
    if (!parsed.success) {
      setErrors({ form: 'Please check your inputs and try again.' });
      return;
    }

    triggerConfetti();
    setIntake(parsed.data);
  };

  const perGuestCost = Math.round(totalBudgetINR / Math.max(1, guestCount));

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Background Decorative Mandala */}
      <div className="pointer-events-none absolute -top-20 -right-20 -z-10 text-accent-primary/20">
        <Mandala size={450} />
      </div>

      {/* Wizard Progress Bar */}
      <div className="mb-8" aria-label="Planning Progress">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-accent-primary">
          <span>Step {currentStep} of 5</span>
          <span>
            {currentStep === 1 && 'Date & Location'}
            {currentStep === 2 && 'Guests & Budget'}
            {currentStep === 3 && 'Ceremonies'}
            {currentStep === 4 && 'Aesthetic & Vibe'}
            {currentStep === 5 && 'Must-Haves & Notes'}
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-bg-card">
          <div
            className="h-full bg-accent-primary transition-all duration-500 ease-out shadow-glow"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Screen Error Notification */}
      {errors.form && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-status-overdue/40 bg-status-overdue/10 p-4 text-sm text-status-overdue"
        >
          {errors.form}
        </div>
      )}

      {/* Step 1: Date & Location */}
      {currentStep === 1 && (
        <GlassCard className="space-y-6">
          <div className="border-b border-border-subtle pb-4">
            <h1 className="font-serif text-2xl font-bold text-accent-primary sm:text-3xl">
              When & where is the celebration?
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Let&apos;s map out your muhurat date and location tier for regional vendor benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="coupleNames" className="block text-sm font-medium text-text-secondary">
                Couple Names (Optional)
              </label>
              <div className="relative mt-1">
                <input
                  id="coupleNames"
                  type="text"
                  value={coupleNames}
                  onChange={(e) => setCoupleNames(e.target.value)}
                  placeholder="e.g. Aarav & Simran"
                  className="w-full rounded-lg border border-border-subtle bg-bg-primary/60 px-4 py-2.5 text-text-primary placeholder-text-muted focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
                />
                <Heart className="absolute right-3 top-3 h-4 w-4 text-accent-primary/60" />
              </div>
            </div>

            <div>
              <label htmlFor="weddingDate" className="block text-sm font-medium text-text-secondary">
                Wedding / Pheras Date *
              </label>
              <div className="relative mt-1">
                <input
                  id="weddingDate"
                  type="date"
                  required
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full rounded-lg border border-border-subtle bg-bg-primary/60 px-4 py-2.5 text-text-primary focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
                />
                <Calendar className="absolute right-3 top-3 h-4 w-4 pointer-events-none text-accent-primary/60" />
              </div>
              {errors.weddingDate && (
                <p className="mt-1 text-xs text-status-overdue">{errors.weddingDate}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary">
              City Tier & Destination *
            </label>
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CITY_TIERS.map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setCityTier(tier)}
                  className={`flex flex-col text-left rounded-xl border p-4 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary ${
                    cityTier === tier
                      ? 'border-accent-primary bg-accent-primary/10 shadow-glow'
                      : 'border-border-subtle bg-bg-primary/40 hover:border-border-highlight'
                  }`}
                >
                  <span className="font-semibold text-text-primary">{CITY_TIER_LABELS[tier]}</span>
                  <span className="mt-1 text-xs text-text-muted">
                    {tier === 'destination' && 'High travel & hotel logistics share'}
                    {tier === 'tier_1' && 'Premium banquet venue & vendor rates'}
                    {tier === 'tier_2' && 'Balanced rates with vibrant local options'}
                    {tier === 'tier_3' && 'Maximum value per guest plate'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="cityName" className="block text-sm font-medium text-text-secondary">
              Specific City Name (Optional)
            </label>
            <input
              id="cityName"
              type="text"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              placeholder="e.g. Udaipur, Mumbai, Lucknow"
              className="mt-1 w-full rounded-lg border border-border-subtle bg-bg-primary/60 px-4 py-2 text-text-primary placeholder-text-muted focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
            />
          </div>
        </GlassCard>
      )}

      {/* Step 2: Guests & Budget */}
      {currentStep === 2 && (
        <GlassCard className="space-y-6">
          <div className="border-b border-border-subtle pb-4">
            <h1 className="font-serif text-2xl font-bold text-accent-primary sm:text-3xl">
              Guests & Total Budget
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Our deterministic Hare-Niemeyer engine will allocate every rupee down to zero drift.
            </p>
          </div>

          {/* Budget Presets */}
          <div>
            <label htmlFor="totalBudget" className="block text-sm font-medium text-text-secondary">
              Total Budget (INR ₹) *
            </label>
            <div className="relative mt-2">
              <input
                id="totalBudget"
                type="number"
                step="50000"
                min="200000"
                max="100000000"
                value={totalBudgetINR}
                onChange={(e) => setTotalBudgetINR(Number(e.target.value))}
                className="w-full rounded-lg border border-border-subtle bg-bg-primary/60 px-4 py-3 text-lg font-bold text-accent-primary focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
              />
              <IndianRupee className="absolute right-3 top-3.5 h-5 w-5 text-accent-primary/60" />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {[1500000, 2500000, 4000000, 7500000, 15000000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTotalBudgetINR(preset)}
                  className={`rounded-lg border px-3 py-1 text-xs font-medium transition-all ${
                    totalBudgetINR === preset
                      ? 'border-accent-primary bg-accent-primary text-bg-primary font-bold'
                      : 'border-border-subtle bg-bg-primary/50 text-text-secondary hover:border-accent-primary'
                  }`}
                >
                  ₹{(preset / 100000).toFixed(0)} Lakhs
                </button>
              ))}
            </div>
          </div>

          {/* Guest Count */}
          <div>
            <label htmlFor="guestCount" className="block text-sm font-medium text-text-secondary">
              Estimated Guest Count *
            </label>
            <div className="relative mt-2">
              <input
                id="guestCount"
                type="number"
                min="20"
                max="5000"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full rounded-lg border border-border-subtle bg-bg-primary/60 px-4 py-3 text-lg font-bold text-text-primary focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
              />
              <Users className="absolute right-3 top-3.5 h-5 w-5 text-accent-primary/60" />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {[100, 250, 400, 600, 1000].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setGuestCount(count)}
                  className={`rounded-lg border px-3 py-1 text-xs font-medium transition-all ${
                    guestCount === count
                      ? 'border-accent-primary bg-accent-primary text-bg-primary font-bold'
                      : 'border-border-subtle bg-bg-primary/50 text-text-secondary hover:border-accent-primary'
                  }`}
                >
                  {count} Guests
                </button>
              ))}
            </div>
          </div>

          {/* Live Per-Guest Preview Card */}
          <div className="rounded-xl border border-border-primary bg-bg-card-hover p-4 shadow-glass">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-text-muted">
                  Deterministic Spending Index
                </span>
                <p className="font-serif text-xl font-bold text-accent-primary">
                  ₹{perGuestCost.toLocaleString('en-IN')}{' '}
                  <span className="text-sm font-normal text-text-secondary">/ guest</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-text-muted">Includes 10% Safety Cushion</span>
                <p className="text-sm font-semibold text-status-ok">
                  ₹{Math.round(totalBudgetINR * 0.1).toLocaleString('en-IN')} Contingency
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Step 3: Ceremonies & Functions */}
      {currentStep === 3 && (
        <GlassCard className="space-y-6">
          <div className="border-b border-border-subtle pb-4">
            <h1 className="font-serif text-2xl font-bold text-accent-primary sm:text-3xl">
              Which ceremonies are you celebrating?
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Select all events you are hosting. Our engines calculate separate timelines and DJ/decor allocations accordingly.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {WEDDING_FUNCTIONS.map((func) => {
              const isSelected = selectedFunctions.includes(func);
              return (
                <button
                  key={func}
                  type="button"
                  onClick={() => toggleFunction(func)}
                  className={`flex items-start justify-between rounded-xl border p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary ${
                    isSelected
                      ? 'border-accent-primary bg-accent-primary/10 shadow-glow'
                      : 'border-border-subtle bg-bg-primary/40 hover:border-border-highlight'
                  }`}
                >
                  <div>
                    <span className="font-serif text-base font-semibold text-text-primary">
                      {WEDDING_FUNCTION_LABELS[func]}
                    </span>
                    <p className="mt-1 text-xs text-text-muted">
                      {func === 'haldi' && 'Yellow hues, marigolds, holy paste, joyful dholak.'}
                      {func === 'mehendi' && 'Henna artists, folk songs, intimate seating & tea.'}
                      {func === 'sangeet' && 'Dance floor, DJ consoles, choreographed performances.'}
                      {func === 'wedding' && 'Main Mandap, Vedic sacred pheras & Varmala.'}
                      {func === 'reception' && 'Formal dining, photo stage & congratulatory speeches.'}
                    </p>
                  </div>
                  <div
                    className={`ml-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                      isSelected
                        ? 'border-accent-primary bg-accent-primary text-bg-primary'
                        : 'border-border-subtle'
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
          {errors.selectedFunctions && (
            <p className="text-xs text-status-overdue">{errors.selectedFunctions}</p>
          )}
        </GlassCard>
      )}

      {/* Step 4: Aesthetic & Vibe */}
      {currentStep === 4 && (
        <GlassCard className="space-y-6">
          <div className="border-b border-border-subtle pb-4">
            <h1 className="font-serif text-2xl font-bold text-accent-primary sm:text-3xl">
              Choose your wedding vibe
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Selecting your vibe immediately sets your visual theme and guides our AI personalization engine.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {WEDDING_VIBES.map((v) => {
              const info = WEDDING_VIBE_LABELS[v];
              const isSelected = vibe === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => handleVibeSelect(v)}
                  className={`flex flex-col rounded-xl border p-5 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary ${
                    isSelected
                      ? 'border-accent-primary bg-accent-primary/10 shadow-glow'
                      : 'border-border-subtle bg-bg-primary/40 hover:border-border-highlight'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg font-bold text-accent-primary">
                      {info.title}
                    </span>
                    {isSelected && <Check className="h-5 w-5 text-accent-primary" />}
                  </div>
                  <p className="mt-2 text-xs text-text-secondary leading-relaxed">{info.desc}</p>
                </button>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* Step 5: Must-Haves, Voice Input & Priorities */}
      {currentStep === 5 && (
        <GlassCard className="space-y-6">
          <div className="border-b border-border-subtle pb-4">
            <h1 className="font-serif text-2xl font-bold text-accent-primary sm:text-3xl">
              Must-haves & special priorities
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Which 2-3 aspects matter the most? Our engine boosts their budget weight deterministically.
            </p>
          </div>

          {/* Priority Badges */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {USER_PRIORITIES.map((prio) => {
              const isSelected = priorities.includes(prio);
              return (
                <button
                  key={prio}
                  type="button"
                  onClick={() => togglePriority(prio)}
                  className={`flex items-center justify-between rounded-lg border p-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary ${
                    isSelected
                      ? 'border-accent-primary bg-accent-primary/15 text-accent-primary font-semibold'
                      : 'border-border-subtle bg-bg-primary/40 text-text-secondary hover:border-border-highlight'
                  }`}
                >
                  <span className="text-xs sm:text-sm">{USER_PRIORITY_LABELS[prio]}</span>
                  {isSelected && <Check className="h-4 w-4 shrink-0 text-accent-primary ml-1" />}
                </button>
              );
            })}
          </div>

          {/* Special Notes with Web Speech Voice Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="specialNotes" className="text-sm font-medium text-text-secondary">
                Special Family Notes or Preferences (Max 500 chars)
              </label>

              {isSpeechRecognitionSupported() && (
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                    isListening
                      ? 'bg-status-overdue text-white animate-pulse'
                      : 'border border-accent-primary/40 bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-3 w-3" /> Listening...
                    </>
                  ) : (
                    <>
                      <Mic className="h-3 w-3" /> Voice Input
                    </>
                  )}
                </button>
              )}
            </div>

            <textarea
              id="specialNotes"
              rows={3}
              maxLength={500}
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="e.g. Groom family is travelling from the US, bride wants pastel lehenga and open-air mandap."
              className="w-full rounded-lg border border-border-subtle bg-bg-primary/60 p-3 text-sm text-text-primary placeholder-text-muted focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
            />
            {speechError && <p className="text-xs text-status-risk">{speechError}</p>}
          </div>
        </GlassCard>
      )}

      {/* Navigation Controls */}
      <div className="mt-8 flex items-center justify-between border-t border-border-subtle pt-4">
        {currentStep > 1 ? (
          <Button
            variant="secondary"
            onClick={handleBack}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>
        ) : (
          <div />
        )}

        <Button
          variant="primary"
          onClick={handleNext}
          rightIcon={
            currentStep === 5 ? (
              <Sparkles className="h-4 w-4" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )
          }
        >
          {currentStep === 5 ? 'Generate My Jashn Plan' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};
