/* Question 1. Discuss one or more common design pattern used in React development
-Briefly explain the pattern and its purpose
-A code example demonstrating how the pattern is implemented
-The advantage and disadvantages of using the pattern.*/

/*Solution 1:
Custom Hook Pattern is a way to encapsulate the logic of a component in a reusable function. 
Custom Hooks are JavaScript functions that leverage the Hooks that React provides (useState, useEffect, useContext, etc.) 
and can be shared across components to streamline the capture and reuse of logic. */

import {
useState,useEffect,useMemo
} from 'react' ;
import axios, {
AxiosResponse,AxiosError
} from 'axios' ;
import React from 'react' ;

/*Using TypeScript and React – below is an example of a Custom Hook that makes a generic HTTP Request. 
This Hook takes care of the logic to perform the request and deal with the load status, data and errors.*/

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

/*Advantages
Promotes code reuse by encapsulating reusable logic in separate functions.
Facilitates code readability and build-up by separating the logic from the component.
Improves testability by enabling more focused and accurate unit tests on the logic wrapped by Custom Hooks.

Disadvantages
Can introduce additional complexity when abused and too many Custom Hooks are created.
Requires a good understanding of React and Hooks concepts to implement them properly.*/

/* Question 2. Creative Problem Solving: "Dynamic Ticket Pricing"
You’re building a React component to display ticket prices that adjust dynamically based on
demand. Write a functional React component TicketPrice that:
● Takes a prop basePrice (number) and demandFactor (number between 0 and 1).
● Calculates the final price as basePrice * (1 + demandFactor).
● Updates the displayed price every 5 seconds with a new demandFactor (simulate this
with a random value between 0 and 1).
● Example: <TicketPrice basePrice={50} demandFactor={0.2} /> initially shows
"$60.00".
● Use TypeScript for type safety and include a cleanup mechanism.*/

/* Solution 2:

Approach:
We created a working component that takes basePrice and demandFactor, and re-calculates the final price every 5 seconds.
We periodically generate a random demand factor by using setInterval, and utilize useEffect for setup and cleanup.*/

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

/* Question 3. Data Structures / Algorithms: "Seat Availability Queue"
Implement a TypeScript class SeatQueue to manage available seats in a venue using a
queue-like structure. It should support:
● addSeat(seatId: string): Add a seat to the queue.
● reserveSeat(): string | null: Remove and return the next available seat, or null
if none.
● getAvailableCount(): number: Return the number of available seats.
● Use a linked list internally for O(1) enqueue and dequeue operations.
● Example: queue.addSeat("A1"); queue.addSeat("A2"); queue.reserveSeat(); //
returns "A1".*/

/* Solution 3:

Approach:
We implement a queue data structure with a singly linked list for O(1) enqueue and dequeue operations. 
The addSeat, reserveSeat, and getAvailableCount methods support seat management and tracking in constant time.*/

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

/*4. Code Refactoring: "React Ticket List Cleanup"
Below is a messy React component for displaying a list of tickets. Refactor it into cleaner,
more maintainable code using TypeScript. Add comments explaining your improvements.
javascript

function TicketsList(props) {
const tickets = props.tickets;
return (
<div>
<h1>Tickets</h1>
{tickets.map(t => <div>{t.name} - ${t.price}</div>)}
</div>
);
}
// Usage: <TicketsList tickets={[{name: "GA", price: 20}, {name: "VIP",
price: 50}]} />*/

/* Solution 4:

Approach:
We refactored a dirty ticket list component into a clean, typed functional component. 
It uses brief props typing and has a key prop to render a list for readability and maintainability.*/

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

/*5. Language Fluency: "React Filter Hook"
Write a custom React hook useTicketFilter in TypeScript that filters a list of tickets based
on a price range. The hook should:
● Take an array of tickets ({ id: string, price: number }[]) and return filtered
tickets.

● Provide controls to set a minPrice and maxPrice filter.
● Example: For tickets = [{id: "1", price: 10}, {id: "2", price: 30}], filtering
with minPrice=20 returns [{id: "2", price: 30}].
● Include a brief explanation of your approach.*/

/* Solution 5:

Approach:
We created a custom hook for filtering tickets by price range through useMemo. 
It has setters for minPrice and maxPrice to allow dynamic filtering with performance optimization through memoization.*/

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
