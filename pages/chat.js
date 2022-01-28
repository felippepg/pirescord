import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useEffect, useState } from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDg2OTA3MywiZXhwIjoxOTU2NDQ1MDczfQ.343ibq7UYFPDdyfsfGmEqUma01RW7P7KC9U2MDAGSkI';
const SUPABASE_URL = 'https://kysxypdmtxjlkdysdlas.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ChatPage() {
  const [mensagem, setMensagem] = useState('')
  const [listaMensagens, setListaMensagens] = useState([])

  useEffect(function(){
    supabaseClient
      .from('mensagens')
      .select('*')
      .order('id', { ascending: false })
      .then(({ data }) => {
        setListaMensagens(data)
      })
      
  }, [])
  // Sua lógica vai aqui
  const handleAddMessageToList = (message) => {
    const mensagem = {
      de: 'felippepg',
      texto: message
    }

    supabaseClient
      .from('mensagens')
      .insert([
        mensagem
      ])
      .then(({ data }) => {
        console.log(data)
        setListaMensagens([
          data[0], 
          ...listaMensagens
        ])
      })

    setMensagem('')
  }
  // ./Sua lógica vai aqui
  return (
    <Box
      styleSheet={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundImage: `url(https://i.pinimg.com/originals/8a/ed/07/8aed075b2259a6f2bace5c4924ceb0a3.jpg)`,
        backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000']
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: '100%',
          maxWidth: '95%',
          maxHeight: '95vh',
          padding: '32px',
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px',
          }}
        >

          <MessageList mensagens={listaMensagens} mudarLista={setListaMensagens}/>
          <Box
            as="form"
            styleSheet={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <TextField
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              value={mensagem}
              onChange={function (event) {
                setMensagem(event.target.value)
              }}
              onKeyPress={function (event) {
                if (event.key === "Enter") {
                  event.preventDefault()
                  handleAddMessageToList(mensagem)
                }
              }}
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <Button
              onClick={function () {
                handleAddMessageToList(mensagem)
              }}
              label='Enviar'
              size="lg"
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
              styleSheet={{
                resize: 'none',
                padding: '6px 8px',
                borderRadius: '5px',
                height: '44px'
              }}
            >
              Enviar
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function Header() {
  return (
    <>
      <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
        <Text variant='heading5'>
          Chat
        </Text>
        <Button
          variant='tertiary'
          colorVariant='neutral'
          label='Logout'
          href="/"
        />
      </Box>
    </>
  )
}

function MessageList(props) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: 'scroll',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: '16px',
      }}
    >
      {props.mensagens.map(function (mensagem, index) {
        return (
          <Box
            as='div'
            key={index}
            styleSheet={{
              display: 'flex',
              justifyContent: 'space-betweeen'
            }}
          >
            <Text
              tag="li"
              styleSheet={{
                borderRadius: '5px',
                padding: '6px',
                marginBottom: '12px',
                width: '100%',
                border: '0',
                resize: 'none',
                hover: {
                  backgroundColor: appConfig.theme.colors.neutrals[700],
                }
              }}
            >
              <Box
                styleSheet={{
                  marginBottom: '8px',
                }}
              >
                <Image
                  alt="teste"
                  styleSheet={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'inline-block',
                    marginRight: '8px',
                  }}
                  src={`https://github.com/${mensagem.de}.png`}
                />
                <Text tag="strong">
                  {mensagem.de}
                </Text>
                <Text
                  styleSheet={{
                    fontSize: '10px',
                    marginLeft: '8px',
                    color: appConfig.theme.colors.neutrals[300],
                  }}
                  tag="span"
                >
                  {(new Date().toLocaleDateString())}
                </Text>
              </Box>
              {mensagem.texto}
            </Text>
            <Button
              iconName="removeFormat"
              onClick={function() {
                const novaLista = props.mensagens
                novaLista.splice(index, 1)
                props.mudarLista([...novaLista])
              }}
            />
          </Box>
        )
      })}
    </Box>
  )
}
