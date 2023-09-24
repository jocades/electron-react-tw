import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { Button, ButtonProps } from './ui/button'

import {
  BracesIcon,
  Check,
  ChevronsUpDown,
  HistoryIcon,
  MessageCircleIcon,
  XIcon,
} from 'lucide-react'
import useToggle from '@/lib/hooks/use-toggle'
import { useState } from 'react'

interface Language {
  label: string
  value: string
}

export const languages: Language[] = [
  { label: 'Spanish', value: 'es' },
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
]

interface LanguageSelectorProps {
  onSelect?: (value: Language['value']) => void
  value?: Language['value']
  className?: ButtonProps['className']
}

export function LanguageSelector(
  { onSelect = () => {}, value, className }: LanguageSelectorProps,
) {
  const [show, toggle] = useToggle()
  const [selected, setSelected] = useState(value)

  return (
    <Popover open={show} onOpenChange={toggle}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          className={cn(
            'w-full tex-sm justify-between',
            'text-xs text-popover-foreground',
            !selected && 'text-muted-foreground',
            className,
          )}
        >
          {selected
            ? languages.find(
              (language) => language.value === selected,
            )?.label
            : 'Select language'}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <ScrollArea className='h-80'>
          <Command>
            <CommandInput placeholder='Search language...' />
            <CommandEmpty>
              No language found.
            </CommandEmpty>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  className='text-sm text-popover-foreground '
                  value={language.value}
                  key={language.value}
                  onSelect={(value) => {
                    setSelected(value)
                    onSelect(value)
                    toggle()
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      language.value === selected ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {language.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
