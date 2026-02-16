'use client';

import { Box, Button, Popover, TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import type { PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import dayjs, { type Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface DateRangePickerInputProps {
  inputId?: string;
  inputClassName?: string;
  containerClassName?: string;
  format?: string;
  offsetY?: number;
  emitInitialValue?: boolean;
  variant?: 'input' | 'inline';
  useMuiInput?: boolean;
  muiInputLabel?: string;
  muiInputRequired?: boolean;
  muiInputSx?: TextFieldProps['sx'];
  onValueChange?: (displayValue: string, selectedDates: [Dayjs, Dayjs]) => void;
}

const DEFAULT_FORMAT = 'MMMM DD';
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
    },
    '& .MuiPickersDay-root:hover': {
      backgroundColor: 'rgba(235, 102, 43, 0.14)',
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

function resolveRange(firstDate: Dayjs, secondDate: Dayjs): [Dayjs, Dayjs] {
  if (secondDate.isBefore(firstDate, 'day')) {
    return [secondDate, firstDate];
  }

  return [firstDate, secondDate];
}

export default function DateRangePickerInput({
  inputId,
  inputClassName = 'custom_input-picker',
  containerClassName = 'custom_container-picker',
  format = DEFAULT_FORMAT,
  offsetY = 10,
  emitInitialValue = false,
  variant = 'input',
  useMuiInput = false,
  muiInputLabel,
  muiInputRequired,
  muiInputSx,
  onValueChange,
}: DateRangePickerInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const today = useMemo(() => dayjs().startOf('day'), []);
  const maxSelectableDate = useMemo(
    () =>
      dayjs()
        .year(today.year() + 5)
        .endOf('year'),
    [today],
  );

  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const [popoverPlacement, setPopoverPlacement] = useState<'top' | 'bottom'>('bottom');
  const [startDate, setStartDate] = useState<Dayjs>(today);
  const [endDate, setEndDate] = useState<Dayjs>(today.add(1, 'day'));
  const [isSelectingRangeEnd, setIsSelectingRangeEnd] = useState(false);
  const [hoveredInlineDate, setHoveredInlineDate] = useState<Dayjs | null>(null);

  const [draftStartDate, setDraftStartDate] = useState<Dayjs>(today);
  const [draftEndDate, setDraftEndDate] = useState<Dayjs>(today.add(1, 'day'));
  const [isSelectingDraftRangeEnd, setIsSelectingDraftRangeEnd] = useState(false);
  const [hoveredDraftDate, setHoveredDraftDate] = useState<Dayjs | null>(null);

  const displayValue = useMemo(
    () => `${startDate.format(format)} - ${endDate.format(format)}`,
    [startDate, endDate, format],
  );

  const emitValueChange = useCallback(
    (nextStartDate: Dayjs, nextEndDate: Dayjs) => {
      onValueChange?.(`${nextStartDate.format(format)} - ${nextEndDate.format(format)}`, [
        nextStartDate,
        nextEndDate,
      ]);
    },
    [format, onValueChange],
  );

  const setDraftFromCommitted = useCallback(() => {
    setDraftStartDate(startDate);
    setDraftEndDate(endDate);
    setIsSelectingDraftRangeEnd(false);
    setHoveredDraftDate(null);
  }, [startDate, endDate]);

  const applyCommittedRange = useCallback(
    (nextStartDate: Dayjs, nextEndDate: Dayjs) => {
      setStartDate(nextStartDate);
      setEndDate(nextEndDate);
      emitValueChange(nextStartDate, nextEndDate);
    },
    [emitValueChange],
  );

  useEffect(() => {
    if (!emitInitialValue || !onValueChange) {
      return;
    }

    emitValueChange(startDate, endDate);
  }, [emitInitialValue, onValueChange, emitValueChange, startDate, endDate]);

  const handleInlineRangeChange = useCallback(
    (selectedDate: Dayjs) => {
      if (!isSelectingRangeEnd) {
        applyCommittedRange(selectedDate, selectedDate);
        setIsSelectingRangeEnd(true);
        setHoveredInlineDate(selectedDate);
        return;
      }

      const [nextStartDate, nextEndDate] = resolveRange(startDate, selectedDate);
      applyCommittedRange(nextStartDate, nextEndDate);
      setIsSelectingRangeEnd(false);
      setHoveredInlineDate(null);
    },
    [isSelectingRangeEnd, startDate, applyCommittedRange],
  );

  const handleDraftRangeChange = useCallback(
    (selectedDate: Dayjs) => {
      if (!isSelectingDraftRangeEnd) {
        setDraftStartDate(selectedDate);
        setDraftEndDate(selectedDate);
        setIsSelectingDraftRangeEnd(true);
        setHoveredDraftDate(selectedDate);
        return;
      }

      const [nextStartDate, nextEndDate] = resolveRange(draftStartDate, selectedDate);
      setDraftStartDate(nextStartDate);
      setDraftEndDate(nextEndDate);
      setIsSelectingDraftRangeEnd(false);
      setHoveredDraftDate(null);
    },
    [isSelectingDraftRangeEnd, draftStartDate],
  );

  const handleDateChange = useCallback(
    (dateValue: Dayjs | null) => {
      const selectedDate = normalizeDate(dateValue, today);

      if (variant === 'inline') {
        handleInlineRangeChange(selectedDate);
        return;
      }

      handleDraftRangeChange(selectedDate);
    },
    [variant, today, handleInlineRangeChange, handleDraftRangeChange],
  );

  const handleOpenPicker = useCallback(() => {
    if (variant !== 'input') {
      return;
    }

    setDraftFromCommitted();
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
  }, [variant, setDraftFromCommitted]);

  const handleClosePicker = useCallback(() => {
    setDraftFromCommitted();
    setAnchorElement(null);
  }, [setDraftFromCommitted]);

  const handleCancelPicker = useCallback(() => {
    setDraftFromCommitted();
    setAnchorElement(null);
  }, [setDraftFromCommitted]);

  const handleApplyPicker = useCallback(() => {
    applyCommittedRange(draftStartDate, draftEndDate);
    setIsSelectingRangeEnd(false);
    setIsSelectingDraftRangeEnd(false);
    setHoveredDraftDate(null);
    setAnchorElement(null);
  }, [draftStartDate, draftEndDate, applyCommittedRange]);

  const handleClearPicker = useCallback(() => {
    const defaultStartDate = today;
    const defaultEndDate = today.add(1, 'day');

    setDraftStartDate(defaultStartDate);
    setDraftEndDate(defaultEndDate);
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    setIsSelectingRangeEnd(false);
    setIsSelectingDraftRangeEnd(false);
    setHoveredInlineDate(null);
    setHoveredDraftDate(null);
    emitValueChange(defaultStartDate, defaultEndDate);
  }, [today, emitValueChange]);

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

      // Close as soon as the anchor is no longer fully visible to avoid Popover re-position flicker.
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

  const rangeStartDate = variant === 'inline' ? startDate : draftStartDate;
  const rangeEndDate = variant === 'inline' ? endDate : draftEndDate;
  const isSelectingRangeEndDate =
    variant === 'inline' ? isSelectingRangeEnd : isSelectingDraftRangeEnd;
  const hoveredRangeDate = variant === 'inline' ? hoveredInlineDate : hoveredDraftDate;
  const previewRangeEndDate =
    isSelectingRangeEndDate && hoveredRangeDate ? hoveredRangeDate : rangeEndDate;
  const [visualRangeStartDate, visualRangeEndDate] = useMemo(
    () => resolveRange(rangeStartDate, previewRangeEndDate),
    [rangeStartDate, previewRangeEndDate],
  );
  const setHoveredRangeDate = variant === 'inline' ? setHoveredInlineDate : setHoveredDraftDate;
  const activeCalendarDate = rangeEndDate;

  const RangeDay = useCallback(
    (dayProps: PickersDayProps) => {
      const dayValue = dayjs(dayProps.day).startOf('day');
      const isRangeStart = dayValue.isSame(visualRangeStartDate, 'day');
      const isRangeEnd = dayValue.isSame(visualRangeEndDate, 'day');
      const isInRange =
        dayValue.isAfter(visualRangeStartDate, 'day') &&
        dayValue.isBefore(visualRangeEndDate, 'day');
      const isSingleDayRange = isRangeStart && isRangeEnd;
      const isRangeDay = isRangeStart || isRangeEnd || isInRange;

      return (
        <PickersDay
          {...dayProps}
          disableMargin
          onMouseEnter={(event) => {
            dayProps.onMouseEnter?.(event, dayProps.day);

            if (isSelectingRangeEndDate) {
              setHoveredRangeDate(dayValue);
            }
          }}
          sx={{
            borderRadius: '10px',
            ...(isRangeDay && {
              borderRadius: 0,
            }),
            ...(isInRange && {
              '&, &:hover, &:focus, &.Mui-selected, &.Mui-selected:hover, &.Mui-selected:focus': {
                backgroundColor: `${ACCENT_COLOR} !important`,
                color: '#fff !important',
              },
            }),
            ...(isRangeStart && {
              '&, &:hover, &:focus, &.Mui-selected, &.Mui-selected:hover, &.Mui-selected:focus': {
                backgroundColor: `${ACCENT_COLOR} !important`,
                color: '#fff !important',
              },
              fontWeight: 700,
              borderTopLeftRadius: '10px',
              borderBottomLeftRadius: '10px',
              borderTopRightRadius: isSingleDayRange ? '10px' : 0,
              borderBottomRightRadius: isSingleDayRange ? '10px' : 0,
            }),
            ...(isRangeEnd && {
              '&, &:hover, &:focus, &.Mui-selected, &.Mui-selected:hover, &.Mui-selected:focus': {
                backgroundColor: `${ACCENT_COLOR} !important`,
                color: '#fff !important',
              },
              fontWeight: 700,
              borderTopRightRadius: '10px',
              borderBottomRightRadius: '10px',
              borderTopLeftRadius: isSingleDayRange ? '10px' : 0,
              borderBottomLeftRadius: isSingleDayRange ? '10px' : 0,
            }),
          }}
        />
      );
    },
    [visualRangeStartDate, visualRangeEndDate, isSelectingRangeEndDate, setHoveredRangeDate],
  );

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
          slots={{ day: RangeDay }}
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
              required={muiInputRequired}
              label={muiInputLabel}
              value={displayValue}
              onClick={handleOpenPicker}
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
