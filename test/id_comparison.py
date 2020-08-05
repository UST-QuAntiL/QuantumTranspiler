if __name__ == "__main__":
    circuit = bernstein_vazirani_general_qiskit_integer(12, 20) 
    
    

    # print(circuit)
    test = TestTranspilation()
    test.simulate(circuit, plot=False)
