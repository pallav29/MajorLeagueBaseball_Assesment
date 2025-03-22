// 1. Discuss one or more common design pattern used in React development

// Custom Hook Pattern is a way to encapsulate the logic of a component in a reusable function. 
// Custom Hooks are JavaScript functions that leverage the Hooks that React provides (useState, useEffect, useContext, etc.) 
// and can be shared across components to streamline the capture and reuse of logic.

import {
useState,useEffect,useMemo
} from 'react' ;
import axios, {
AxiosResponse,AxiosError
} from 'axios' ;
import React from 'react' ;

// Using TypeScript and React – below is an example of a Custom Hook that makes a generic HTTP Request. 
// This Hook takes care of the logic to perform the request and deal with the load status, data and errors.

type ApiResponse<T> = {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
};

function useFetch<T>(url:  string): ApiResponse<T>{
    const [data,setData] =  useState<T|null>(null) ;
   const [loading,setLoading] =  useState<boolean>(true);
  const [error,setError] =  useState<AxiosError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: AxiosResponse<T>=await axios.get(url);
        setData(response.data);
      }catch (error){
        setError(error as AxiosError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Using the Custom Hook on a component
function ExampleComponent() {
  const {data,loading,error} = useFetch<{id: number;name: string }>('https://test.com/api/data');

  if(loading) return<div>Loading...</div>;
  if (error)  return <div>Error:{error.message}</div>;
  if(!data)  return <div>No data.</div>;

  return <div>{data.name}</div>;
}

// 2. Creative Problem Solving: "Dynamic Ticket Pricing"
// A React component that displays ticket prices that adjust dynamically based on demand.
// It takes a basePrice and demandFactor, calculates the price, and updates every 5 seconds.

interface TicketPriceProps {
  basePrice: number;
  demandFactor: number;
}

const TicketPrice: React.FC<TicketPriceProps> = ({basePrice, demandFactor})=>{
  const [currentDF,setCurrentDF] =useState<number>(demandFactor);

  useEffect(() => {
    const priceUpdateInterval = setInterval(() => {
      const updatedDemandFactor = Math.random();
      setCurrentDF(updatedDemandFactor);
    }, 5000);

    return () => clearInterval(priceUpdateInterval);
  }, []);

  const finalPrice = basePrice * (1 + currentDF);

  return <div>${finalPrice.toFixed(2)}</div>;
};

// 3. Data Structures / Algorithms: "Seat Availability Queue"
// Implement a TypeScript class SeatQueue to manage available seats in a venue using a queue-like structure.
// Supports addSeat, reserveSeat, getAvailableCount. Uses a linked list internally.

class ListNode {
  seatId: string;
  next: ListNode | null = null;

  constructor(seatId: string) {
    this.seatId = seatId;
  }
}

class SeatQueue {
  private head: ListNode | null = null;
  private tail: ListNode | null = null;
  private size: number = 0;

  addSeat(seatId: string): void {
    const newNode = new ListNode(seatId);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
    }
    this.size++;
  }

  reserveSeat(): string | null {
    if (!this.head) return null;
    const seatId = this.head.seatId;
    this.head = this.head.next;
    if (!this.head) this.tail = null;
    this.size--;
    return seatId;
  }

  getAvailableCount(): number {
    return this.size;
  }
}

// 4. Code Refactoring: "React Ticket List Cleanup"
// Refactored to use TypeScript, prop interfaces, and clean structure with unique keys.

interface Ticket {
  name: string;
  price: number;
}

interface TicketsListProps {
  tickets: Ticket[];
}

const TicketsList: React.FC<TicketsListProps>=({tickets})=>{
  return (
    <div>
      <h1>Tickets</h1>
      {tickets.map((ticket) => (
        <div key={ticket.name}>
          {ticket.name} - ${ticket.price}
        </div>
      ))}
    </div>
  );
};

// 5. Language Fluency: "React Filter Hook"
// Write a custom hook useTicketFilter that filters tickets by price range.
// It allows setting minPrice and maxPrice, and returns filtered results.

interface FilterTicket {
  id: string;
  price: number;
}

function useTicketFilter(tickets:FilterTicket[] ){
        const [minPrice,setMinPrice]=useState<number>(0) ;
     const [maxPrice,setMaxPrice]=useState<number>(Infinity) ;

  const filteredTickets = useMemo(() => {
    return tickets.filter(
      (ticket) => ticket.price >= minPrice && ticket.price <= maxPrice
    );
  }, [tickets, minPrice, maxPrice]);

  return {
    filteredTickets,
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
  };
}

// Usage example for useTicketFilter
const TicketFilterExample = () => {
  const tickets = [
    { id: '1', price: 10 },
    { id: '2', price: 30 },
    { id: '3', price: 50 },
  ];

  const {
    filteredTickets,
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
  } = useTicketFilter(tickets);

  return (
    <div>
      <h2>Filter Tickets</h2>
      <input
        type="number"
        value={minPrice}
        onChange={
(e) => setMinPrice(Number(e.target.value))
}
        placeholder="Min Price"
      />
      <input
        type="number"
        value={maxPrice}
        onChange={
(e) => setMaxPrice(Number(e.target.value))
}
        placeholder="Max Price"
      />
      <ul>
        {filteredTickets.map((ticket) => (
          <li key={ticket.id}>
            Ticket {ticket.id} - ${ticket.price}
          </li>
        ))}
      </ul>
    </div>
  );
};
