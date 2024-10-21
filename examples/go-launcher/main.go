package main

import (
	_ "embed"
	"fmt"
	"os"
	"os/exec"
)

//go:embed ethrepl.js
var ethReplScript string

func main() {
	if ethReplScript == "" {
		fmt.Println("Error: ethrepl.js is empty or not found")
		os.Exit(1)
	}

	// Create a temporary file to store the ethrepl script
	tempFile, err := os.CreateTemp("", "ethrepl-*.js")
	if err != nil {
		fmt.Println("Error creating temporary file:", err)
		os.Exit(1)
	}
	defer os.Remove(tempFile.Name())

	// Write the ethrepl script to the temporary file
	_, err = tempFile.WriteString(ethReplScript)
	if err != nil {
		fmt.Println("Error writing to temporary file:", err)
		os.Exit(1)
	}
	tempFile.Close()

	// Find the path to the Node.js executable
	nodePath, err := exec.LookPath("node")
	if err != nil {
		fmt.Println("Node.js not found. Please ensure Node.js is installed and in your PATH.")
		os.Exit(1)
	}

	// Prepare the command to run the ethrepl script
	cmd := exec.Command(nodePath, tempFile.Name())
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	// Run the command
	err = cmd.Run()
	if err != nil {
		fmt.Println("Error running ethrepl:", err)
		os.Exit(1)
	}
}
