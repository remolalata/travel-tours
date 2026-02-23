'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import AdminRichTextEditor from '@/components/admin/help-center/AdminRichTextEditor';
import AppButton from '@/components/common/button/AppButton';
import AppTextField from '@/components/common/form/AppTextField';
import { getFaqItemDisplayTitle } from '@/features/admin/help-center/helpers/faqManager';
import type { AdminHelpCenterContent } from '@/types/admin';
import type { AdminFaqManagerItem } from '@/types/adminHelpCenter';

type AdminFaqAccordionItemProps = {
  item: AdminFaqManagerItem;
  index: number;
  expanded: boolean;
  onToggleExpanded: () => void;
  onQuestionChange: (value: string) => void;
  onAnswerChange: (value: string) => void;
  onRemove: () => void;
  content: AdminHelpCenterContent['faqManager'];
};

export default function AdminFaqAccordionItem({
  item,
  index,
  expanded,
  onToggleExpanded,
  onQuestionChange,
  onAnswerChange,
  onRemove,
  content,
}: AdminFaqAccordionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const title = getFaqItemDisplayTitle(
    item,
    index,
    content.item.untitledPrefix,
    content.placeholders.emptyQuestion,
  );

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.7 : 1,
      }}
    >
      <Accordion
        expanded={expanded}
        onChange={onToggleExpanded}
        disableGutters
        sx={{
          borderRadius: '16px !important',
          border: '1px solid rgba(5, 7, 60, 0.10)',
          boxShadow: '0 12px 30px rgba(5, 7, 60, 0.06)',
          overflow: 'hidden',
          '&:before': { display: 'none' },
        }}
      >
        <AccordionSummary
          expandIcon={<i className='icon-chevron-down text-14' aria-hidden='true' />}
          aria-label={content.item.expandIconAriaLabel}
          sx={{
            px: 2,
            py: 1,
            minHeight: '64px !important',
            '& .MuiAccordionSummary-content': {
              margin: '8px 0 !important',
              alignItems: 'center',
            },
          }}
        >
          <button
            type='button'
            {...attributes}
            {...listeners}
            aria-label={content.item.dragHandleAriaLabel}
            onClick={(event) => event.stopPropagation()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 10,
              border: '1px solid rgba(5, 7, 60, 0.12)',
              background: '#fff',
              marginRight: 12,
              cursor: 'grab',
              flexShrink: 0,
            }}
          >
            <i className='icon-main-menu text-14' aria-hidden='true'></i>
          </button>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              component='div'
              sx={{
                color: '#05073c',
                fontWeight: 600,
                fontSize: 15,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                pr: 2,
              }}
            >
              {title}
            </Typography>
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ px: 2, pb: 2 }}>
          <div className='row y-gap-20'>
            <div className='col-12'>
              <AppTextField
                label={content.fields.question}
                value={item.question}
                onChange={onQuestionChange}
                sx={{
                  '& .MuiOutlinedInput-input': {
                    '&::placeholder': {
                      opacity: 0.85,
                    },
                  },
                }}
              />
            </div>

            <div className='col-12'>
              <div className='mb-10 text-14 fw-500'>{content.fields.answer}</div>
              <AdminRichTextEditor
                value={item.answerHtml}
                onChange={onAnswerChange}
                toolbarLabels={content.toolbar}
                ariaLabel={content.fields.answer}
              />
            </div>

            <div className='col-12 d-flex justify-end'>
              <AppButton size='sm' variant='outline' onClick={onRemove}>
                {content.item.removeLabel}
              </AppButton>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
