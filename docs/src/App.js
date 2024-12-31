import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Container,
  Input,
  Button,
  Select,
  Text,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Link,
  IconButton,
  Flex,
  useColorMode,
  useColorModeValue,
  Heading,
  Stack,
  SlideFade,
  Spinner,
  ScaleFade,
  CloseButton,
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash, FaSun, FaMoon, FaSmile } from 'react-icons/fa';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

function App() {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [ws, setWs] = useState(null);
  const [connected, setConnected] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [status, setStatus] = useState({
    type: 'online',
    activity: 'PLAYING',
    text: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  const connect = () => {
    setIsLoading(true);
    console.log('Attempting to connect to Discord gateway...');
    if (!token) {
      toast({
        title: 'Error',
        description: 'Please enter your Discord token',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    const wsConnection = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json');
    let interval;

    wsConnection.onopen = () => {
      console.log('Connected to Discord gateway');
      toast({
        title: 'Connected',
        description: 'Successfully connected to Discord gateway',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
    };

    wsConnection.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received message from Discord gateway:', data);
      handleGatewayMessage(data, wsConnection, interval);
    };

    wsConnection.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to Discord',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
    };

    wsConnection.onclose = () => {
      console.log('Disconnected from Discord gateway');
      setConnected(false);
      clearInterval(interval);
      toast({
        title: 'Disconnected',
        description: 'Disconnected from Discord gateway',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
    };

    setWs(wsConnection);
  };

  const handleGatewayMessage = (data, wsConnection, interval) => {
    const { op, t, d } = data;
    console.log('Handling gateway message:', { op, t, d });

    switch (op) {
      case 10: // Hello
        interval = setInterval(() => {
          wsConnection.send(JSON.stringify({ op: 1, d: null }));
        }, d.heartbeat_interval);

        wsConnection.send(JSON.stringify({
          op: 2,
          d: {
            token: token,
            properties: {
              $os: 'browser',
              $browser: 'Discord Status Customizer',
              $device: 'Discord Status Customizer'
            },
            presence: {
              status: status.type,
              activities: [{
                name: status.text || 'Discord Status Customizer',
                type: status.activity === 'PLAYING' ? 0 : 
                      status.activity === 'STREAMING' ? 1 : 
                      status.activity === 'LISTENING' ? 2 : 
                      status.activity === 'WATCHING' ? 3 : 
                      status.activity === 'COMPETING' ? 5 : 0
              }]
            }
          }
        }));
        console.log('Sent identify payload to Discord gateway');
        break;

      case 0: // Dispatch
        if (t === 'READY') {
          console.log('Received READY event from Discord gateway');
          setConnected(true);
          toast({
            title: 'Ready',
            description: 'Successfully authenticated with Discord',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        }
        break;

      default:
        console.log('Unhandled gateway message:', data);
        break;
    }
  };

  const updateStatus = () => {
    setIsUpdating(true);
    console.log('Updating status...');
    if (!ws || !connected) {
      toast({
        title: 'Error',
        description: 'Not connected to Discord',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsUpdating(false);
      return;
    }

    const presence = {
      op: 3,
      d: {
        since: null,
        activities: [{
          name: status.text || 'Discord Status Customizer',
          type: status.activity === 'PLAYING' ? 0 : 
                status.activity === 'STREAMING' ? 1 : 
                status.activity === 'LISTENING' ? 2 : 
                status.activity === 'WATCHING' ? 3 : 
                status.activity === 'COMPETING' ? 5 : 0
        }],
        status: status.type,
        afk: false
      }
    };

    ws.send(JSON.stringify(presence));
    console.log('Sent presence update to Discord gateway:', presence);
    toast({
      title: 'Status Updated',
      description: 'Successfully updated Discord status',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    setIsUpdating(false);
  };

  const disconnect = () => {
    console.log('Disconnecting from Discord gateway...');
    if (ws) {
      ws.close();
      setWs(null);
      setConnected(false);
    }
  };

  return (
    <ChakraProvider>
      <Box minH="100vh" bg={bgColor} py={10}>
        <Container maxW={{ base: "container.sm", md: "container.md" }}>
          <VStack spacing={6}>
            <Flex w="full" justify="flex-end">
              <IconButton
                icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
                onClick={toggleColorMode}
                variant="ghost"
                aria-label="Toggle dark/light mode"
              />
            </Flex>

            {showAlert && (
              <Alert
                status="warning"
                variant="left-accent"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                borderRadius="md"
                mb={4}
                bg="yellow.100"
                color="yellow.800"
                boxShadow="lg"
              >
                <Flex justify="space-between" w="full">
                  <Flex align="center">
                    <AlertIcon boxSize="24px" mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize="lg">
                      Important Notice
                    </AlertTitle>
                  </Flex>
                  <CloseButton position="absolute" right="8px" top="8px" onClick={() => setShowAlert(false)} />
                </Flex>
                <AlertDescription maxWidth="sm">
                  This tool is for educational purposes only. For a more reliable CLI version, visit:{' '}
                  <Link
                    href="https://github.com/ToolsPeople200/always-online"
                    color="blue.500"
                    isExternal
                  >
                    GitHub Repository
                  </Link>
                </AlertDescription>
              </Alert>
            )}

            <SlideFade in={true} offsetY="20px">
              <Box w="full" bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
                {!connected ? (
                  <VStack spacing={4}>
                    <Heading as="h2" size="lg">Connect to Discord</Heading>
                    <Flex w="full">
                      <Input
                        type={showToken ? 'text' : 'password'}
                        placeholder="Enter your Discord token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        mr={2}
                      />
                      <IconButton
                        icon={showToken ? <FaEyeSlash /> : <FaEye />}
                        onClick={() => setShowToken(!showToken)}
                      />
                    </Flex>
                    <Button colorScheme="primary" onClick={connect} w="full" isLoading={isLoading}>
                      Connect
                    </Button>
                  </VStack>
                ) : (
                  <VStack spacing={4}>
                    <Heading as="h2" size="lg">Update Status</Heading>
                    <Select
                      value={status.type}
                      onChange={(e) => setStatus({ ...status, type: e.target.value })}
                    >
                      <option value="online">🟢 Online</option>
                      <option value="idle">🌙 Idle</option>
                      <option value="dnd">⛔ Do Not Disturb</option>
                      <option value="invisible">⚫ Invisible</option>
                    </Select>
                    <Select
                      value={status.activity}
                      onChange={(e) => setStatus({ ...status, activity: e.target.value })}
                    >
                      <option value="PLAYING">🎮 Playing</option>
                      <option value="LISTENING">🎵 Listening to</option>
                      <option value="WATCHING">📺 Watching</option>
                      <option value="STREAMING">🎥 Streaming</option>
                      <option value="COMPETING">🏆 Competing in</option>
                    </Select>
                    <Flex w="full">
                      <Input
                        placeholder="Status text"
                        value={status.text}
                        onChange={(e) => setStatus({ ...status, text: e.target.value })}
                        mr={2}
                      />
                      <IconButton
                        icon={<FaSmile />}
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      />
                    </Flex>
                    {showEmojiPicker && (
                      <Box position="absolute" zIndex="modal">
                        <Picker
                          data={data}
                          onEmojiSelect={(emoji) => {
                            setStatus({ ...status, text: status.text + emoji.native });
                            setShowEmojiPicker(false);
                          }}
                          theme={colorMode}
                        />
                      </Box>
                    )}
                    <Button colorScheme="primary" onClick={updateStatus} w="full" isLoading={isUpdating}>
                      Update Status
                    </Button>
                    <Button colorScheme="red" onClick={disconnect} w="full">
                      Disconnect
                    </Button>
                  </VStack>
                )}
              </Box>
            </SlideFade>
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;