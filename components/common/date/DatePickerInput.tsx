'use client';

import { Box, Button, Popover, TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { type Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface DatePickerInputProps {
  inputId?: string;
  inputClassName?: string;
  containerClassName?: string;
  initialDisplayValue?: string;
  format?: string;
  offsetY?: number;
  emitInitialValue?: boolean;
  variant?: 'input' | 'inline';
  useMuiInput?: boolean;
  muiInputLabel?: string;
  muiInputRequired?: boolean;
  muiInputError?: boolean;
  muiInputHelperText?: string;
  muiInputSx?: TextFieldProps['sx'];
  initialSelectedDate?: Dayjs | null;
  allowEmpty?: boolean;
  onValueChange?: (displayValue: string, selectedDate: Dayjs) => void;
}

const DEFAULT_FORMAT = 'MMMM DD, YYYY';
const ACCENT_COLOR = 'var(--color-accent-1)';
const CALENDAR_ROW_HEIGHT = 40;

function getVisibleWeekCount(dateValue: Dayjs): number {
  const monthStart = dateValue.startOf('month').startOf('week');
  const monthEnd = dateValue.endOf('month').endOf('week');
  const visibleDays = monthEnd.diff(monthStart, 'day') + 1;
  const computedWeeks = Math.ceil(visibleDays / 7);

  return Math.max(4, Math.min(6, computedWeeks));
}

function buildCalendarSx(minHeightPx: number) {
  return {
    height: 'auto',
    minHeight: 0,
    '& .MuiDateCalendar-viewTransitionContainer': {
      minHeight: 0,
    },
    '& .MuiDayCalendar-slideTransition': {
      minHeight: `${minHeightPx}px`,
    },
    '& .MuiDayCalendar-loadingContainer': {
      minHeight: `${minHeightPx}px`,
    },
    '& .MuiDayCalendar-weekContainer': {
      margin: 0,
    },
    '& .MuiPickersDay-root': {
      transition: 'background-color 0.22s ease, color 0.22s ease',
      borderRadius: '10px',
    },
    '& .MuiPickersDay-root:hover': {
      backgroundColor: 'rgba(235, 102, 43, 0.14)',
    },
    '& .MuiPickersDay-root.Mui-selected, & .MuiPickersDay-root.Mui-selected:hover, & .MuiPickersDay-root.Mui-selected:focus':
      {
        backgroundColor: `${ACCENT_COLOR} !important`,
        color: '#fff !important',
        borderRadius: '10px',
      },
    '& .MuiPickersDay-root.Mui-focusVisible': {
      backgroundColor: 'rgba(235, 102, 43, 0.2)',
    },
    '& .MuiDayCalendar-weekDayLabel': {
      color: ACCENT_COLOR,
      fontWeight: 700,
    },
    '& .MuiPickersCalendarHeader-label': {
      fontWeight: 700,
      color: 'var(--color-dark-1)',
    },
    '& .MuiPickersArrowSwitcher-button': {
      color: ACCENT_COLOR,
    },
  };
}

function normalizeDate(value: Dayjs | null | undefined, fallback: Dayjs): Dayjs {
  return value && value.isValid() ? value.startOf('day') : fallback.startOf('day');
}

function parseDisplayDate(displayValue: string | undefined, fallbackDate: Dayjs): Dayjs | null {
  if (!displayValue) {
    return null;
  }

  const parsed = dayjs(displayValue);

  if (parsed.isValid()) {
    return parsed.startOf('day');
  }

  const fallbackYear = fallbackDate.year();
  const fallbackParsed = dayjs(new Date(`${displayValue}, ${fallbackYear}`));

  return fallbackParsed.isValid() ? fallbackParsed.startOf('day') : null;
}

export default function DatePickerInput({
  inputId,
  inputClassName = 'custom_input-picker',
  containerClassName = 'custom_container-picker',
  initialDisplayValue,
  format = DEFAULT_FORMAT,
  offsetY = 10,
  emitInitialValue = false,
  variant = 'input',
  useMuiInput = false,
  muiInputLabel,
  muiInputRequired,
  muiInputError,
  muiInputHelperText,
  muiInputSx,
  initialSelectedDate,
  allowEmpty = false,
  onValueChange,
}: DatePickerInputProps) {
  const muiInputLabelProps = muiInputRequired ? { required: true } : undefined;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const today = useMemo(() => dayjs().startOf('day'), []);
  const normalizedInitialDate = useMemo(() => {
    if (initialSelectedDate) {
      return normalizeDate(initialSelectedDate, today);
    }

    return parseDisplayDate(initialDisplayValue, today);
  }, [initialDisplayValue, initialSelectedDate, today]);
  const maxSelectableDate = useMemo(
    () =>
      dayjs()
        .year(today.year() + 5)
        .endOf('year'),
    [today],
  );

  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const [popoverPlacement, setPopoverPlacement] = useState<'top' | 'bottom'>('bottom');
  const [selectedDate, setSelectedDate] = useState<Dayjs>(normalizedInitialDate ?? today);
  const [draftDate, setDraftDate] = useState<Dayjs>(normalizedInitialDate ?? today);
  const [hasCommittedSelection, setHasCommittedSelection] = useState(
    !allowEmpty || Boolean(normalizedInitialDate),
  );

  const displayValue = useMemo(
    () => (hasCommittedSelection ? selectedDate.format(format) : ''),
    [selectedDate, format, hasCommittedSelection],
  );

  const emitDateChange = useCallback(
    (nextDate: Dayjs) => {
      onValueChange?.(nextDate.format(format), nextDate);
    },
    [format, onValueChange],
  );

  const syncDraftFromCommitted = useCallback(() => {
    setDraftDate(selectedDate);
  }, [selectedDate]);

  const applyCommittedDate = useCallback(
    (nextDate: Dayjs) => {
      setSelectedDate(nextDate);
      setHasCommittedSelection(true);
      emitDateChange(nextDate);
    },
    [emitDateChange],
  );

  useEffect(() => {
    if (!emitInitialValue || !onValueChange) {
      return;
    }

    if (!hasCommittedSelection) {
      return;
    }

    emitDateChange(selectedDate);
  }, [emitInitialValue, onValueChange, emitDateChange, selectedDate, hasCommittedSelection]);

  const handleDateChange = useCallback(
    (dateValue: Dayjs | null) => {
      const nextDate = normalizeDate(dateValue, today);

      if (variant === 'inline') {
        applyCommittedDate(nextDate);
        return;
      }

      setDraftDate(nextDate);
    },
    [variant, today, applyCommittedDate],
  );

  const handleOpenPicker = useCallback(() => {
    if (variant !== 'input') {
      return;
    }

    syncDraftFromCommitted();
    const currentInput = inputRef.current;
    if (!currentInput) {
      return;
    }

    const resolvedAnchor =
      (currentInput.closest('.searchFormItem') as HTMLElement | null) ??
      (currentInput.closest('.searchFormItem__button') as HTMLElement | null) ??
      currentInput;

    const { top, bottom } = resolvedAnchor.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const estimatedPickerHeight = 420;
    const hasSpaceBelow = viewportHeight - bottom >= estimatedPickerHeight;
    const hasSpaceAbove = top >= estimatedPickerHeight;

    setPopoverPlacement(hasSpaceBelow || !hasSpaceAbove ? 'bottom' : 'top');
    setAnchorElement(resolvedAnchor);
  }, [variant, syncDraftFromCommitted]);

  const handleClosePicker = useCallback(() => {
    syncDraftFromCommitted();
    setAnchorElement(null);
  }, [syncDraftFromCommitted]);

  const handleCancelPicker = useCallback(() => {
    syncDraftFromCommitted();
    setAnchorElement(null);
  }, [syncDraftFromCommitted]);

  const handleApplyPicker = useCallback(() => {
    applyCommittedDate(draftDate);
    setAnchorElement(null);
  }, [draftDate, applyCommittedDate]);

  const handleClearPicker = useCallback(() => {
    const defaultDate = today;

    setDraftDate(defaultDate);
    setSelectedDate(defaultDate);
    setHasCommittedSelection(!allowEmpty);

    if (!allowEmpty) {
      emitDateChange(defaultDate);
    }
  }, [today, emitDateChange, allowEmpty]);

  const isOpen = Boolean(anchorElement);

  useEffect(() => {
    if (!isOpen || variant !== 'input') {
      return;
    }

    const isAnchorVisible = () => {
      const targetElement = anchorElement ?? inputRef.current;
      if (!targetElement) {
        return false;
      }

      const rect = targetElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      return (
        rect.top >= 0 &&
        rect.bottom <= viewportHeight &&
        rect.left >= 0 &&
        rect.right <= viewportWidth
      );
    };

    const handleViewportChange = () => {
      if (!isAnchorVisible()) {
        handleClosePicker();
      }
    };

    window.addEventListener('scroll', handleViewportChange, true);
    window.addEventListener('resize', handleViewportChange);

    return () => {
      window.removeEventListener('scroll', handleViewportChange, true);
      window.removeEventListener('resize', handleViewportChange);
    };
  }, [isOpen, variant, anchorElement, handleClosePicker]);

  const activeCalendarDate = variant === 'inline' ? selectedDate : draftDate;
  const calendarSx = useMemo(
    () => buildCalendarSx(getVisibleWeekCount(activeCalendarDate) * CALENDAR_ROW_HEIGHT),
    [activeCalendarDate],
  );

  const calendarContent = (
    <Box className='muiDateRangePicker__panel'>
      <Box className='muiDateRangePicker__calendar'>
        <DateCalendar
          value={activeCalendarDate}
          onChange={handleDateChange}
          showDaysOutsideCurrentMonth
          disableHighlightToday
          disablePast
          minDate={today}
          maxDate={maxSelectableDate}
          sx={calendarSx}
        />
      </Box>

      {variant === 'input' && (
        <Box className='muiDateRangePicker__actions'>
          <Button
            type='button'
            variant='text'
            size='small'
            onClick={handleClearPicker}
            sx={{
              textTransform: 'none',
              color: 'var(--color-dark-1)',
              mr: 'auto',
            }}
          >
            Clear
          </Button>
          <Button
            type='button'
            variant='outlined'
            size='small'
            disableElevation
            onClick={handleCancelPicker}
            sx={{
              textTransform: 'none',
              borderColor: 'rgba(23, 23, 23, 0.22)',
              color: 'var(--color-dark-1)',
            }}
          >
            Cancel
          </Button>
          <Button
            type='button'
            variant='contained'
            size='small'
            disableElevation
            onClick={handleApplyPicker}
            sx={{
              backgroundColor: 'var(--color-accent-1)',
              boxShadow: 'none',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#d55522', boxShadow: 'none' },
              '&:focus': { boxShadow: 'none' },
            }}
          >
            Apply
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {variant === 'inline' ? (
        <div className={containerClassName}>{calendarContent}</div>
      ) : (
        <div className={containerClassName}>
          {useMuiInput ? (
            <TextField
              id={inputId}
              inputRef={inputRef}
              fullWidth
              label={muiInputLabel}
              value={displayValue}
              onClick={handleOpenPicker}
              error={muiInputError}
              helperText={muiInputHelperText}
              InputLabelProps={muiInputLabelProps}
              InputProps={{
                readOnly: true,
                sx: {
                  cursor: 'pointer',
                  '& input': {
                    cursor: 'pointer',
                  },
                },
              }}
              sx={muiInputSx}
            />
          ) : (
            <input
              id={inputId}
              ref={inputRef}
              className={inputClassName}
              value={displayValue}
              readOnly
              onClick={handleOpenPicker}
            />
          )}
          <Popover
            open={isOpen}
            anchorEl={anchorElement}
            onClose={handleClosePicker}
            disableScrollLock
            disableRestoreFocus
            transitionDuration={{ enter: 120, exit: 0 }}
            anchorOrigin={{
              vertical: popoverPlacement === 'bottom' ? 'bottom' : 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: popoverPlacement === 'bottom' ? 'top' : 'bottom',
              horizontal: 'left',
            }}
            slotProps={{
              paper: {
                sx: {
                  ...(popoverPlacement === 'bottom'
                    ? { mt: `${offsetY}px` }
                    : { mb: `${offsetY}px` }),
                  borderRadius: '16px',
                  boxShadow: '0 22px 48px rgba(20, 20, 43, 0.2)',
                },
              },
            }}
          >
            {calendarContent}
          </Popover>
        </div>
      )}
    </LocalizationProvider>
  );
}
