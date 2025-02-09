
import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { cn } from "@/lib/utils";
import { EventModal } from './EventModal';
import { ViewSelector } from './ViewSelector';
import { ChatWithAI } from './ChatWithAI';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
}

export function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [currentView, setCurrentView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'>('dayGridMonth');

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event);
    setIsEventModalOpen(true);
  };

  const handleDateSelect = (selectInfo: any) => {
    setSelectedEvent({
      id: '',
      title: '',
      start: selectInfo.start,
      end: selectInfo.end,
      allDay: selectInfo.allDay,
    });
    setIsEventModalOpen(true);
  };

  const handleEventDrop = (dropInfo: any) => {
    const updatedEvents = events.map(event => {
      if (event.id === dropInfo.event.id) {
        return {
          ...event,
          start: dropInfo.event.start,
          end: dropInfo.event.end,
        };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  const handleEventSave = (event: CalendarEvent) => {
    if (event.id) {
      setEvents(prev => prev.map(e => e.id === event.id ? event : e));
    } else {
      setEvents(prev => [...prev, { ...event, id: crypto.randomUUID() }]);
    }
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="h-screen bg-white dark:bg-gray-900 overflow-hidden">
      <div className="flex flex-col h-full">
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CalendarIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Calendar</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ViewSelector currentView={currentView} onViewChange={setCurrentView} />
            <Button
              onClick={() => {
                setSelectedEvent(null);
                setIsEventModalOpen(true);
              }}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              headerToolbar={false}
              initialView={currentView}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              events={events}
              select={handleDateSelect}
              eventClick={handleEventClick}
              eventDrop={handleEventDrop}
              height="100%"
            />
          </div>
        </div>
      </div>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onSave={handleEventSave}
        onDelete={handleEventDelete}
      />

      <ChatWithAI onAddEvent={handleEventSave} />
    </div>
  );
}
