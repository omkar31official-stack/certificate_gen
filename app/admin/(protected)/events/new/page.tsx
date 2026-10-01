import { createEvent } from "@/lib/actions/event";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewEventPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/admin/events" className="text-gray-500 hover:text-gray-900 bg-white p-2 rounded-full border shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
          <p className="text-gray-500 mt-1">Set up a new event for SLUG</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6 sm:p-8">
        <form action={createEvent} className="space-y-6">
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Event Name *</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="e.g. Git & GitHub Workshop 2026"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                id="description" 
                name="description" 
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="Brief description of the event..."
              ></textarea>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
              <input 
                type="date" 
                id="startDate" 
                name="startDate" 
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
              <input 
                type="date" 
                id="endDate" 
                name="endDate" 
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-gray-700">Venue</label>
              <input 
                type="text" 
                id="venue" 
                name="venue" 
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="e.g. Main Auditorium"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select 
                id="category" 
                name="category"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="Workshop">Workshop</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Seminar">Seminar</option>
                <option value="Competition">Competition</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="organizer" className="block text-sm font-medium text-gray-700">Organizer</label>
              <input 
                type="text" 
                id="organizer" 
                name="organizer" 
                defaultValue="SLUG"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-6 border-t flex justify-end space-x-3">
            <Link 
              href="/admin/events"
              className="bg-white border text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium shadow-sm"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
